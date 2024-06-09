import { utils } from "@defisaver/tokens";
import { useContext, useState } from "react";

import GlobalContext from "@/context/GlobalContext";
import { CollateralType } from "@/types/globalTypes";
import { useCdpContract } from "@/hooks/useCdpContract";

export const useFinance = (cdpId: string) => {
  const { cdpContract, ilksContract, provider } = useContext(GlobalContext);
  const {
    totalDebt,
    fetchCdpById,
    getCollateralRate,
    getCollateralPrice,
    getLiquidationRationForCollateral,
  } = useCdpContract({
    provider: provider!,
    cdpContract: cdpContract!,
    ilksContract: ilksContract!,
  });
  const [debt, setDebt] = useState<number>();
  const [owner, setOwner] = useState<string>();
  const [collateral, setCollateral] = useState<number>();
  const [liquidationFee, setLiquidationFee] = useState<number>();
  const [collateralPrice, setCollateralPrice] = useState<number>();
  const [liquidationRatio, setLiquidationRatio] = useState<number>();
  const [collateralType, setCollateralType] = useState<CollateralType>();
  const [collateralUsdValue, setCollateralUsdValue] = useState<number>();
  const [collateralizationRatio, setCollateralizationRatio] =
    useState<number>();
  const [
    maxDebtRemainingBeforeLiquidation,
    setMaxDebtRemainingBeforeLiquidation,
  ] = useState<number>();
  const [
    maxCollateralWithdrawBeforeLiquidation,
    setMaxCollateralWithdrawBeforeLiquidation,
  ] = useState<number>();

  const getFinancialData = async () => {
    const cdp = await fetchCdpById(+cdpId!);
    setOwner(cdp.owner);
    const collateralType = utils.bytesToString(cdp.ilk);
    const colRate = await getCollateralRate(
      CollateralType[collateralType as keyof typeof CollateralType]
    );
    const debt = cdp.debt;
    const fullDebt = totalDebt(debt, colRate) / 1e9;
    const [colPrice, liqRatio] = await Promise.all([
      getCollateralPrice(
        CollateralType[collateralType as keyof typeof CollateralType]
      ),
      getLiquidationRationForCollateral(
        CollateralType[collateralType as keyof typeof CollateralType]
      ),
    ]);

    const collateral = +parseFloat(
      provider!.utils.fromWei(cdp.collateral, "ether")
    );

    setCollateral(collateral);

    setCollateralType(
      CollateralType[collateralType as keyof typeof CollateralType]
    );

    setDebt(fullDebt);

    const collateralUsdValue = collateral * colPrice;

    setCollateralUsdValue(collateralUsdValue);

    const LIQUIDATION_FEE_PERCENTAGE = 13;
    const liquidationPrice =
      (+provider!.utils.fromWei(debt, "ether") * LIQUIDATION_FEE_PERCENTAGE) /
      100;
    const collRatio = (collateralUsdValue / fullDebt) * 100;
    const minCollateralValueBeforeLiquidation = fullDebt * 1.5;
    const minCollateralBeforeLiquidation =
      minCollateralValueBeforeLiquidation / colPrice;
    const maxDebtBeforeLiquidation = 1.5 * fullDebt - collateral;
    const maxCollWithdrawBeforeLiquidation = (
      collateral - minCollateralBeforeLiquidation
    ).toFixed(2);
    const maxDebtIncurBeforeLiquidation = (
      maxDebtBeforeLiquidation - fullDebt
    ).toFixed(2);

    setLiquidationFee(liquidationPrice);
    setMaxCollateralWithdrawBeforeLiquidation(
      +maxCollWithdrawBeforeLiquidation
    );
    setMaxDebtRemainingBeforeLiquidation(+maxDebtIncurBeforeLiquidation);
    setCollateralizationRatio(collRatio);

    setCollateralPrice(colPrice);
    setLiquidationRatio(liqRatio);
  };

  return {
    debt,
    owner,
    collateral,
    liquidationFee,
    collateralType,
    collateralPrice,
    getFinancialData,
    liquidationRatio,
    collateralUsdValue,
    collateralizationRatio,
    maxDebtRemainingBeforeLiquidation,
    maxCollateralWithdrawBeforeLiquidation,
  };
};
