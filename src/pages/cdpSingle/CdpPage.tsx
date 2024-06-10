import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./CdpPage.scss";
import AppButton from "@/elements/AppButton";
import { useMetaMask } from "@/hooks/useMetaMask";
import CdpDetailCard from "./components/CdpDetailCard";

const ViewCdp: FC = () => {
  const { cdpId } = useParams();
  const navigate = useNavigate();
  const { error, signature, signMyCdp } = useMetaMask();

  const handleBackButtonClick = () => navigate(-1);

  return (
    <div className="cdp-card-container">
      {error && <p className="error">{error.message}</p>}
      <CdpDetailCard cdpId={cdpId!} />
      <div className="cdp-controls">
        <AppButton btnText={"Sign this CDP"} handleClick={signMyCdp} />
        <AppButton
          btnText="Back to CDP list"
          handleClick={handleBackButtonClick}
        />
      </div>
      {signature && <p>{signature}</p>}
    </div>
  );
};

export default ViewCdp;
