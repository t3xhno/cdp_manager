/* eslint-disable react-hooks/exhaustive-deps */
import { type ReactNode, createContext, FC, useEffect } from "react";

import "./GlobalContext.scss";
import NavBar from "../components/navBar/NavBar";
import { useMetaMask } from "../hooks/useMetaMask";
import { type IGlobalContext } from "../types/globalTypes";
import MetaMaskConnected from "@/components/metaMask/MetaMaskConnected";
import MetaMaskNotConnected from "../components/metaMask/MetaMaskNotConnected";

interface IProps {
  children: ReactNode;
}

const GlobalContext = createContext<IGlobalContext>({
  provider: undefined,
  cdpContract: undefined,
  ilksContract: undefined,
});

export const GlobalContextProvider: FC<IProps> = ({ children }) => {
  const {
    error,
    balance,
    provider,
    cdpContract,
    ilksContract,
    isConnecting,
    currentAccount,
    connectToMetaMask,
  } = useMetaMask();

  useEffect(() => {
    connectToMetaMask();
  }, []);

  return (
    <GlobalContext.Provider value={{ provider, cdpContract, ilksContract }}>
      <NavBar>
        {!provider || !cdpContract || !ilksContract ? (
          <MetaMaskNotConnected
            connect={connectToMetaMask}
            isConnecting={isConnecting}
          />
        ) : (
          <MetaMaskConnected account={currentAccount!} balance={balance} />
        )}
      </NavBar>
      <div className="page-wrapper">
        {error && <p className="error">{error.message}</p>}
        {provider && cdpContract && ilksContract ? (
          <>{children}</>
        ) : (
          <p>Awaiting MetaMask connection...</p>
        )}
      </div>
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
