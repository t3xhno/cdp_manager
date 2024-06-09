import { Link } from "react-router-dom";
import { utils } from "@defisaver/tokens";
import { FC, useContext, useState } from "react";

import "./CdpCard.scss";
import GlobalContext from "@/context/GlobalContext";
import { type ExtendedICdp } from "@/types/globalTypes";
import { formatAccount, formatBigNumbers } from "@/utils/strings";

interface IProps {
  cdp: ExtendedICdp;
}

const CdpCard: FC<IProps> = ({ cdp }) => {
  const { provider } = useContext(GlobalContext);
  const [debt] = useState(cdp.totalDebt! / 1e9);
  const [collateral] = useState(
    +provider!.utils.fromWei(cdp.collateral, "ether")
  );

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
              <div className="info-value">{formatBigNumbers(collateral)}</div>
              <div className="info-token faded-text">
                {utils.bytesToString(cdp.ilk)}
              </div>
            </div>
          </div>
          <div className="cdp-detail cdp-debt">
            <div className="info-label faded-text">Debt:</div>
            <div className="info-data">
              <div className="info-value">{formatBigNumbers(debt)}</div>
              <div className="info-token faded-text">DAI</div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CdpCard;
