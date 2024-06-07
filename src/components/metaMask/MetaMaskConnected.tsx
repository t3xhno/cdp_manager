/* eslint-disable @typescript-eslint/no-explicit-any */
import "./MetaMaskConnected.scss";
import jazzicon from "@metamask/jazzicon";
import { FC, useEffect, useRef } from "react";

import { formatAccount } from "@utils/strings";

interface IProps {
  account: string;
}

const MetaMaskConnected: FC<IProps> = ({ account }) => {
  const avatarIcon = useRef<HTMLDivElement>();

  useEffect(() => {
    if (avatarIcon.current && account) {
      const addr = account.slice(2, 10);
      const seed = parseInt(addr, 16);
      const icon = jazzicon(30, seed);
      avatarIcon.current.innerHTML = "";
      avatarIcon.current.appendChild(icon);
    }
  }, [account]);

  return (
    <div className="connected-wrapper">
      <div className="connected-container">
        <div className="connect-avatar">
          <div className="connect-avatar" ref={avatarIcon as any} />
        </div>
        <div className="connected-account">{formatAccount(account)}</div>
        <div className="connected-dot" />
      </div>
    </div>
  );
};

export default MetaMaskConnected;
