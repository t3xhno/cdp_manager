import { FC } from "react";

import "./CdpList.scss";
import CdpCard from "./CdpCard";
import { type ExtendedICdp } from "@/types/globalTypes";

interface IProps {
  cdpList: ExtendedICdp[];
}

const CdpList: FC<IProps> = ({ cdpList }) => (
  <div className="cdp-list-wrapper">
    {cdpList.map((cdp) => (
      <CdpCard key={cdp.cdpId!} cdp={cdp} />
    ))}
  </div>
);

export default CdpList;
