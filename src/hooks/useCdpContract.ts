/* eslint-disable react-hooks/exhaustive-deps */
import type Web3 from "web3";
import { type RpcError } from "web3";
import { utils } from "@defisaver/tokens";
import { useContext, useEffect, useState } from "react";

import { useConfig } from "./useConfig";
import { isStringNumeric } from "@/utils/helpers";
import CacheContext from "@/context/CacheContext";
import { type CdpAbi, type IlksAbi } from "@/types/abiTypes";
import {
  CollateralType,
  type ExtendedICdp,
  type ICdp,
} from "@/types/globalTypes";

type Dir = 0 | 1;

function* cdpIdGenerator(startCdpId: number) {
  let nextLower = startCdpId - 1;
  let nextHigher = startCdpId + 1;
  // Direction flipper (0 for lower, 1 for higher)
  let direction: Dir = 0;
  const flipDirection = (currentDirection: Dir) => (currentDirection ? 0 : 1);

  while (true) {
    if (!direction && nextLower) yield nextLower--;
    if (direction || !nextLower) yield nextHigher++;
    direction = flipDirection(direction);
  }
}

export const useCdpContract = ({
  provider,
  cdpContract,
  ilksContract,
}: {
  provider: Web3;
  cdpContract: CdpAbi;
  ilksContract: IlksAbi;
}) => {
  const {
    setCachedCdpList,
    setCachedCollType,
    cdpList: cachedCdpList,
    collType: cachedCollType,
  } = useContext(CacheContext);
  const [isLoading, setIsLoading] = useState(false);
  const [singleCdp, setSingleCdp] = useState<ICdp>();
  const [cdpList, setCdpList] = useState<ICdp[]>([]);
  const [error, setError] = useState<RpcError | string>();
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [collateralRate, setCollateralRate] = useState<string>();
  const [collateralType, setCollateralType] = useState(cachedCollType);
  const {
    ZERO_ADDRESS,
    CDP_DATA_COUNT,
    MOCKS_RESOLVE_DELAY_MS,
    MAX_CONCURRENT_RPC_CALLS,
  } = useConfig();

  useEffect(() => {
    if (cachedCdpList) setCdpList(cachedCdpList);
    if (cachedCollType) setCollateralType(cachedCollType);
  }, []);

  type TestCdp = (cdp: ICdp, collateralType: string) => boolean;
  const testCdp: TestCdp = (cdp, collateralType) =>
    cdp.owner !== ZERO_ADDRESS &&
    utils.bytesToString(cdp.ilk) === collateralType;

  type TotalDebt = (debt: string, rate: string) => number;
  const totalDebt: TotalDebt = (debt, rate) =>
    +(
      +provider.utils.fromWei(debt, "ether") *
      +provider.utils.fromWei(rate, "ether")
    ).toFixed(2);

  const fetchCdpById = async (cdpId: number) => {
    const cdpData = await cdpContract.methods.getCdpInfo(cdpId).call();
    setSingleCdp(cdpData);
    return cdpData;
  };

  const getCollateralRate = async (collateralType: CollateralType) => {
    return (
      await ilksContract.methods
        .ilks(utils.stringToBytes(collateralType))
        .call()
    ).rate;
  };

  const fetchCdpListByCollateralType = async (
    cdpId: string,
    collateralType: string,
    abortSignal: AbortSignal
  ) => {
    let shouldAbort = false;
    setCachedCdpList(undefined);
    setCachedCollType(CollateralType["ETH-A"]);

    if (!isStringNumeric(cdpId)) {
      setError("Please enter a numeric string as the CDP id");
      return;
    }

    abortSignal.addEventListener("abort", () => {
      shouldAbort = true;
    });

    setLoadingProgress(0);

    setCdpList([]);
    setIsLoading(true);
    setError(undefined);

    try {
      const ilkData = await ilksContract.methods
        .ilks(utils.stringToBytes(collateralType))
        .call();
      setCollateralRate(ilkData.rate);
      const currentCdpData: ExtendedICdp[] = [];
      const initialCdp = await fetchCdpById(+cdpId);

      if (initialCdp.owner === ZERO_ADDRESS)
        throw new Error(`CDP with ID ${cdpId} doesn't exist!`);

      if (testCdp(initialCdp, collateralType))
        currentCdpData.push({
          cdpId: +cdpId,
          totalDebt: totalDebt(initialCdp.debt, ilkData.rate),
          ...initialCdp,
        });

      const nextIdGenerator = cdpIdGenerator(+cdpId);

      let isTopCapped = false;
      /*
       * When top is capped (no more higher id positions), we have to double the batch size, so
       * that we are left with a good size with only lower ids for the next batch. In that
       * double size batch, if the initial batch is an odd number - we will have an alternating
       * [batch size] and [batch size - 1] number of lower ids. In that case, we flip this
       * variable, and add another id to the batch, which will then be lower, and will leave us
       * with a batch size of [batch size] after filtering out the highers.
       *
       * If the initial batch size was even, we can safely assume perfect distribution and don't
       * ever have to add anything to the batch - just halve it by filtering out the higher ids.
       */
      let addOne = true;

      while (currentCdpData.length < CDP_DATA_COUNT && !shouldAbort) {
        const nextBatchSize = Math.min(
          MAX_CONCURRENT_RPC_CALLS,
          CDP_DATA_COUNT - currentCdpData.length
        );

        const nextBatchOfIds = !isTopCapped
          ? Array(nextBatchSize)
              .fill(1)
              .map(() => nextIdGenerator.next().value as number)
          : /*
             * Messy ternary operator logic for adding the padding id,
             * but the logic is strongly coupled to the implementation
             * by definition, anyway.
             */
            Array(nextBatchSize * 2 + (addOne ? (+cdpId % 2 === 0 ? 0 : 1) : 0))
              .fill(1)
              .map(() => nextIdGenerator.next().value as number)
              .filter((id) => id <= +cdpId)
              .slice(0, nextBatchSize);

        // Flip to add/not add one to the next batch of iids
        addOne = !addOne;

        const result = await Promise.all(
          nextBatchOfIds.map((cdpId) => fetchCdpById(cdpId))
        );

        currentCdpData.push(
          ...result
            .map((cdp, index) => ({
              cdpId: nextBatchOfIds[index],
              totalDebt: totalDebt(cdp.debt, ilkData.rate),
              ...cdp,
            }))
            .filter((cdp) => {
              if (cdp.cdpId > +cdpId && cdp.owner === ZERO_ADDRESS)
                isTopCapped = true;
              return testCdp(cdp, collateralType);
            })
        );
        setLoadingProgress(currentCdpData.length);
      }

      setCdpList(currentCdpData);
      setCachedCdpList(currentCdpData);
      setCachedCollType(
        CollateralType[collateralType as keyof typeof CollateralType]
      );
    } catch (error) {
      setError(error as RpcError);
    } finally {
      if (shouldAbort) setError("User aborted.");
      setIsLoading(false);
    }
  };

  // Mocks for collaterals and CDP info
  const getCollateralPrice = async (
    collateralType: CollateralType
  ): Promise<number> => {
    const hardCodedCurrentPricesInUSD = {
      [CollateralType["USDC-A"]]: 1,
      [CollateralType["ETH-A"]]: 3805.74,
      [CollateralType["WBTC-A"]]: 69471.0,
    };

    return new Promise((resolve) =>
      setTimeout(
        () => resolve(hardCodedCurrentPricesInUSD[collateralType]),
        MOCKS_RESOLVE_DELAY_MS
      )
    );
  };

  const getLiquidationRationForCollateral = async (
    collateralType: CollateralType
  ): Promise<number> => {
    const hardCodedLiquidationRatios = {
      [CollateralType["ETH-A"]]: 145,
      [CollateralType["WBTC-A"]]: 145,
      [CollateralType["USDC-A"]]: 101,
    };

    return new Promise((resolve) =>
      setTimeout(
        () => resolve(hardCodedLiquidationRatios[collateralType]),
        MOCKS_RESOLVE_DELAY_MS
      )
    );
  };

  return {
    error,
    cdpList,
    testCdp,
    totalDebt,
    isLoading,
    singleCdp,
    fetchCdpById,
    collateralRate,
    collateralType,
    loadingProgress,
    getCollateralRate,
    getCollateralPrice,
    totalData: CDP_DATA_COUNT,
    fetchCdpListByCollateralType,
    getLiquidationRationForCollateral,
  };
};
