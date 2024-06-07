import { FC, useContext } from "react";
import { Link } from "react-router-dom";
import { utils } from "@defisaver/tokens";

import "./CdpCard.scss";
import { formatAccount } from "@/utils/strings";
import GlobalContext from "@/context/GlobalContext";
import { type ExtendedICdp } from "@/types/globalTypes";

interface IProps {
  cdp: ExtendedICdp;
}

const CdpCard: FC<IProps> = ({ cdp }) => {
  const { provider } = useContext(GlobalContext);

  return (
    <div className="cdp-wrapper">
      <Link to={`cdp/${cdp.cdpId!}`}>
        <div className="cdp-owner">
          <span className="faded-text">Owner</span> {formatAccount(cdp.owner)}
        </div>
        <div className="cdp-details">
          <div className="cdp-detail cdp-collateral">
            <div className="info-label faded-text">Collateral:</div>
            <div className="info-data">
              <div className="info-value">
                {parseFloat(
                  provider!.utils.fromWei(parseInt(cdp.collateral), "ether")
                ).toFixed(2)}
              </div>
              <div className="info-token faded-text">
                {utils.bytesToString(cdp.ilk)}
              </div>
            </div>
          </div>
          <div className="cdp-detail cdp-debt">
            <div className="info-label faded-text">Debt:</div>
            <div className="info-data">
              <div className="info-value">
                {+parseFloat((cdp.totalDebt! / 1e9).toString()).toFixed(2)}
              </div>
              <div className="info-token faded-text">DAI</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CdpCard;
