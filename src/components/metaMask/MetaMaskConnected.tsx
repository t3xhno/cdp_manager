/* eslint-disable @typescript-eslint/no-explicit-any */
import jazzicon from "@metamask/jazzicon";
import { FC, useEffect, useRef } from "react";

import "./MetaMaskConnected.scss";
import { formatAccount } from "@utils/strings";
import AppSpinner from "@/elements/AppSpinner";

interface IProps {
  account: string;
  balance?: string;
}

const MetaMaskConnected: FC<IProps> = ({ account, balance }) => {
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
          <div className="connected-avatar" ref={avatarIcon as any} />
        </div>
        <div className="connected-account">
          <p>{formatAccount(account)}</p>
          <div className="eth-balance">
            {balance ? (
              <p className="eth-balance-value">{balance}</p>
            ) : (
              <AppSpinner size={1} />
            )}
            <span className="faded-text">ETH</span>
          </div>
        </div>
        <div className="connected-dot" />
      </div>
    </div>
  );
};

export default MetaMaskConnected;
