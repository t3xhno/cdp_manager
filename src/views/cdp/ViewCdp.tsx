/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react-hooks/exhaustive-deps */
import { utils } from "@defisaver/tokens";
import { useParams } from "react-router-dom";
import { FC, useContext, useEffect, useState } from "react";

import GlobalContext from "@/context/GlobalContext";
import { CollateralType } from "@/types/globalTypes";
import { useCdpContract } from "@/hooks/useCdpContract";

const ViewCdp: FC = () => {
  const { cdpId } = useParams();
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
  const [collateral, setCollateral] = useState<number>();
  const [collateralPrice, setCollateralPrice] = useState<number>();
  const [liquidationRatio, setLiquidationRatio] = useState<number>();
  const [collateralType, setCollateralType] = useState<CollateralType>();
  const [collateralUsdValue, setCollateralUsdValue] = useState<number>();
  // const [canWithdrawWithoutLiquidation, setCanWithdrawWithoutLiquidation] =
  //   useState<number>();

  useEffect(() => {
    (async () => {
      const cdp = await fetchCdpById(+cdpId!);

      const collateral = +parseFloat(
        provider!.utils.fromWei(cdp.collateral, "ether")
      );

      setCollateral(collateral);

      const collateralType = utils.bytesToString(cdp.ilk);
      setCollateralType(
        CollateralType[collateralType as keyof typeof CollateralType]
      );

      const colRate = await getCollateralRate(
        CollateralType[collateralType as keyof typeof CollateralType]
      );

      const debt = cdp.debt;
      const fullDebt = totalDebt(debt, colRate);

      setDebt(fullDebt);

      const [colPrice, liqRatio] = await Promise.all([
        getCollateralPrice(
          CollateralType[collateralType as keyof typeof CollateralType]
        ),
        getLiquidationRationForCollateral(
          CollateralType[collateralType as keyof typeof CollateralType]
        ),
      ]);

      const collateralUsdValue = collateral * colPrice;

      setCollateralUsdValue(collateralUsdValue);

      setCollateralPrice(colPrice);
      setLiquidationRatio(liqRatio);
    })();
  }, []);

  return (
    <div className="single-cdp">
      <div className="col-price">
        Collateral price:
        {collateralPrice !== undefined ? (
          <p>{collateralPrice}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="cdp-liqidation-ratio">
        Liquidation ratio:
        {liquidationRatio !== undefined ? (
          <p>{liquidationRatio}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="col-value">
        Collateral:
        {collateral !== undefined ? (
          <p>
            {collateral!.toFixed(2)}
            {collateralType}
            {}
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="total-collateral-value-usd">
        Total collateral USD value:
        {collateralUsdValue !== undefined ? (
          <p>${collateralUsdValue.toFixed(2)}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="cdp-debt">
        Debt:{" "}
        {debt !== undefined ? <p>{debt.toFixed(2)}</p> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default ViewCdp;
