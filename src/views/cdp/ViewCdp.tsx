/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";

import "./ViewCdp.scss";
import { useFinance } from "@/hooks/useFinance";
import { formatAccount } from "@/utils/strings";

const ViewCdp: FC = () => {
  const { cdpId } = useParams();
  const {
    debt,
    owner,
    collateral,
    liquidationFee,
    collateralType,
    collateralPrice,
    // liquidationRatio,
    getFinancialData,
    // collateralUsdValue,
    collateralizationRatio,
    maxDebtRemainingBeforeLiquidation,
    maxCollateralWithdrawBeforeLiquidation,
  } = useFinance(cdpId!);

  useEffect(() => {
    getFinancialData();
  }, []);

  return (
    <div className="single-cdp-card">
      <div className="cdp-header">
        <span>Owner: </span>
        {owner !== undefined ? (
          <p>{formatAccount(owner)}</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="cdp-rows">
        <div className="cdp-row">
          <div className="cdp-detail">
            <p className="faded-text">Collateral:</p>
            {collateral !== undefined ? (
              <p>
                {collateral!.toFixed(2)}
                <span className="faded-text">{collateralType}</span>
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          {/* <div className="cdp-detail">
            Total collateral USD value:
            {collateralUsdValue !== undefined ? (
              <p>${collateralUsdValue.toFixed(2)}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div> */}
          <div className="cdp-detail">
            <p className="faded-text">Debt:</p>
            {debt !== undefined ? (
              <p>
                {debt.toFixed(2)}
                <span className="faded-text">DAI</span>
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="cdp-detail">
            <p className="faded-text">Ratio:</p>
            {collateralizationRatio !== undefined ? (
              <p>{collateralizationRatio.toFixed(2)}%</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          {/* <div className="cdp-detail">
            Liquidation ratio:
            {liquidationRatio !== undefined ? (
              <p>{liquidationRatio.toFixed(2)}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div> */}
        </div>
        <div className="cdp-row">
          <div className="cdp-detail">
            <p className="faded-text">Safe to withdraw:</p>
            {maxCollateralWithdrawBeforeLiquidation !== undefined ? (
              <p>
                {maxCollateralWithdrawBeforeLiquidation}
                <span className="faded-text">{collateralType}</span>
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="cdp-detail">
            <p className="faded-text">Safe to indebt:</p>
            {maxDebtRemainingBeforeLiquidation !== undefined ? (
              <p>
                {maxDebtRemainingBeforeLiquidation?.toFixed(2)}
                <span className="faded-text">DAI</span>
              </p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className="cdp-row">
          <div className="cdp-detail">
            <p className="faded-text">Collateral price:</p>
            {collateralPrice !== undefined ? (
              <p>${collateralPrice.toFixed(2)}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="cdp-detail">
            <p className="faded-text">Liquidation fee:</p>
            {liquidationFee != undefined ? (
              <p>${liquidationFee.toFixed(2)}</p>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCdp;
