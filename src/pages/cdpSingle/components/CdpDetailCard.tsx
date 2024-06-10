/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from "react";

import AppSpinner from "@/elements/AppSpinner";
import { useFinance } from "@/hooks/useFinance";
import { formatAccount, formatBigNumbers } from "@/utils/strings";

interface IProps {
  cdpId: string;
}

const CdpDetailCard: FC<IProps> = ({ cdpId }) => {
  const {
    debt,
    owner,
    collateral,
    liquidationFee,
    collateralType,
    collateralPrice,
    liquidationRatio,
    getFinancialData,
    collateralUsdValue,
    collateralizationRatio,
    maxDebtRemainingBeforeLiquidation,
    maxCollateralWithdrawBeforeLiquidation,
  } = useFinance();

  useEffect(() => {
    getFinancialData(cdpId!);
  }, []);

  return (
    <div className="single-cdp-card">
      <div className="cdp-header">
        <span>Owner: </span>
        {owner !== undefined ? <p>{formatAccount(owner)}</p> : <AppSpinner />}
      </div>
      <div className="cdp-rows">
        <div className="cdp-row">
          <div className="cdp-detail">
            <p className="faded-text">Collateral:</p>
            <div className="detail-info has-tooltip">
              {collateral !== undefined ? (
                <div>
                  {formatBigNumbers(collateral!)}
                  <span className="faded-text">{collateralType}</span>
                  <div className="tooltip-box">
                    <p>
                      {collateral.toFixed(2)}
                      <span className="faded-text">{collateralType}</span>
                    </p>
                    <p>${collateralUsdValue?.toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <AppSpinner />
              )}
            </div>
          </div>
          <div className="cdp-detail">
            <p className="faded-text">Debt:</p>
            <div className="detail-info">
              {debt !== undefined ? (
                <p>
                  {formatBigNumbers(debt)}
                  <span className="faded-text">DAI</span>
                </p>
              ) : (
                <AppSpinner />
              )}
            </div>
          </div>
          <div className="cdp-detail">
            <p className="faded-text">
              Ratio: {liquidationRatio && `(min: ${liquidationRatio}%)`}
            </p>
            <div className="detail-info">
              {collateralizationRatio !== undefined ? (
                <p>
                  {!isNaN(collateralizationRatio)
                    ? collateralizationRatio.toFixed(2)
                    : 0}
                  %
                </p>
              ) : (
                <AppSpinner />
              )}
            </div>
          </div>
        </div>
        <div className="cdp-row">
          <div className="cdp-detail">
            <p className="faded-text">Safe to withdraw:</p>
            <div className="detail-info">
              {maxCollateralWithdrawBeforeLiquidation !== undefined ? (
                <p>
                  {formatBigNumbers(maxCollateralWithdrawBeforeLiquidation)}
                  <span className="faded-text">{collateralType}</span>
                </p>
              ) : (
                <AppSpinner />
              )}
            </div>
          </div>
          <div className="cdp-detail">
            <p className="faded-text">Safe to indebt:</p>
            <div className="detail-info">
              {maxDebtRemainingBeforeLiquidation !== undefined ? (
                <p>
                  {formatBigNumbers(maxDebtRemainingBeforeLiquidation)}
                  <span className="faded-text">DAI</span>
                </p>
              ) : (
                <AppSpinner />
              )}
            </div>
          </div>
        </div>
        <div className="cdp-row">
          <div className="cdp-detail">
            <p className="faded-text">Collateral price:</p>
            <div className="detail-info">
              {collateralPrice !== undefined ? (
                <p>${formatBigNumbers(collateralPrice)}</p>
              ) : (
                <AppSpinner />
              )}
            </div>
          </div>
          <div className="cdp-detail">
            <p className="faded-text">Liquidation fee:</p>
            <div className="detail-info">
              {liquidationFee != undefined ? (
                <p>${formatBigNumbers(liquidationFee)}</p>
              ) : (
                <AppSpinner />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CdpDetailCard;
