import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./ViewCdp.scss";
import AppButton from "@/elements/AppButton";
import CdpDetailCard from "./components/CdpDetailCard";
import { useMetaMask } from "@/hooks/useMetaMask";

const ViewCdp: FC = () => {
  const { cdpId } = useParams();
  const navigate = useNavigate();
  const { error, signature, signMyCdp } = useMetaMask();

  const handleBackButtonClick = () => navigate(-1);

  return (
    <div className="cdp-card-container">
      {error && <p className="error">{error.message}</p>}
      <CdpDetailCard cdpId={cdpId!} />
      <AppButton
        btnText="Back to CDP list"
        handleClick={handleBackButtonClick}
      />
      <AppButton btnText={"Sign this CDP"} handleClick={signMyCdp} />
      {signature && <p>{signature}</p>}
    </div>
  );
};

export default ViewCdp;
