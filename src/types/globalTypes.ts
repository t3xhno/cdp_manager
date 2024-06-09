import type Web3 from "web3";

import { type CdpAbi, type IlksAbi } from "./abiTypes";

export interface IGlobalContext {
  provider?: Web3;
  cdpContract?: CdpAbi;
  ilksContract?: IlksAbi;
}

export interface ICachedContext {
  cdpList?: ExtendedICdp[];
  collType: CollateralType;
  setCachedCdpList: (cdpList?: ExtendedICdp[]) => void;
  setCachedCollType: (collType: CollateralType) => void;
}

export enum CollateralType {
  "ETH-A" = "ETH-A",
  "WBTC-A" = "WBTC-A",
  "USDC-A" = "USDC-A",
}

export type ICdp = Awaited<
  ReturnType<Pick<ReturnType<CdpAbi["methods"]["getCdpInfo"]>, "call">["call"]>
>;

export interface ExtendedICdp extends ICdp {
  cdpId?: number;
  totalDebt?: number;
}

export type IIlk = Awaited<
  ReturnType<Pick<ReturnType<IlksAbi["methods"]["ilks"]>, "call">["call"]>
>;
