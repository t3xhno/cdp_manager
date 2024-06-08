import { FC } from "react";

import "./NoCdpFound.scss";
import ScalesImage from "@assets/images/ScalesIcon.png";

const NoCdpFound: FC = () => {
  return (
    <div className="no-cdp-wrapper">
      <img src={ScalesImage} alt="Scales Image" />
      <p>No CDPs found. Try another search!</p>
    </div>
  );
};

export default NoCdpFound;
