import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./ViewCdp.scss";
import AppButton from "@/elements/AppButton";
import CdpDetailCard from "./components/CdpDetailCard";

const ViewCdp: FC = () => {
  const { cdpId } = useParams();
  const navigate = useNavigate();

  const handleBackButtonClick = () => navigate(-1);

  return (
    <div className="cdp-card-container">
      <CdpDetailCard cdpId={cdpId!} />
      <AppButton
        btnText="Back to CDP list"
        handleClick={handleBackButtonClick}
      />
    </div>
  );
};

export default ViewCdp;
