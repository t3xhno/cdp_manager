import { useState } from "react";
import Web3, { type RpcError } from "web3";
import { type CdpAbi, type IlksAbi } from "../types/abiTypes";

import cdpAbi from "@abis/cdpAbi.json";
import ilksAbi from "@abis/ilksAbi.json";
import Web3Service from "@services/web3Service";

const cdpAddress = "0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d";
const ilksAddress = "0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B";

export const useMetaMask = () => {
  const [error, setError] = useState<RpcError>();
  const [provider, setProvider] = useState<Web3>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [cdpContract, setCdpContract] = useState<CdpAbi>();
  const [ilksContract, setIlksContract] = useState<IlksAbi>();
  const [currentAccount, setCurrentAccount] = useState<string>();

  const web3Service = new Web3Service();

  //   Heavy version
  //   const handleAccountChange = async () => {
  //     web3Service.disconnectProvider();
  //     await connectToMetaMask();
  //   };

  const handleAccountChange = (accounts: string[]) => {
    setCurrentAccount(accounts[0]);
  };

  const connectToMetaMask = async () => {
    setError(undefined);
    setIsConnecting(true);
    try {
      setProvider(web3Service.provider);

      if (!(await web3Service.isMetaMaskConnected())) {
        const account = await web3Service.connectNetwork();
        setCurrentAccount(account);
      } else {
        setCurrentAccount(await web3Service.getAccount());
      }

      web3Service.onAccountChanged(handleAccountChange);

      const initCdpContract = (await web3Service.connectContract(
        cdpAbi,
        cdpAddress
      )) as unknown as CdpAbi;
      setCdpContract(initCdpContract);

      const initIlksContract = (await web3Service.connectContract(
        ilksAbi,
        ilksAddress
      )) as unknown as IlksAbi;
      setIlksContract(initIlksContract);

      setError(undefined);
    } catch (error) {
      setError(error as RpcError);
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    error,
    provider,
    cdpContract,
    isConnecting,
    ilksContract,
    currentAccount,
    connectToMetaMask,
  };
};
