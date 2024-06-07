import { FC } from "react";
import "./MetaMaskNotConnected.scss";
import MetaMaskFoxLogo from "@assets/images/MetaMask_Fox.png";

interface IProps {
  isConnecting: boolean;
  connect: () => Promise<void>;
}

const MetaMaskNotConnected: FC<IProps> = ({ connect, isConnecting }) => {
  return (
    <div className="not-connected-wrapper">
      {isConnecting ? (
        <h2>Connecting...</h2>
      ) : (
        <img src={MetaMaskFoxLogo} alt="MetaMaskFoxIcon" onClick={connect} />
      )}
      <div className="no-connection-text">
        <p>Account not connected.</p>
        <p>Click the MetaMask logo to retry connection.</p>
      </div>
    </div>
  );
};

export default MetaMaskNotConnected;
