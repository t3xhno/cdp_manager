import { createContext, FC, ReactNode, useState } from "react";

import {
  CollateralType,
  type ExtendedICdp,
  type ICachedContext,
} from "@/types/globalTypes";

const CacheContext = createContext<ICachedContext>({
  cdpList: [],
  setCachedCdpList: () => {},
  setCachedCollType: () => {},
  collType: CollateralType["ETH-A"],
});

interface IProps {
  children: ReactNode;
}

export const CacheProvider: FC<IProps> = ({ children }) => {
  const [cachedCdpList, setCachedCdpList] = useState<ExtendedICdp[]>();
  const [cachedCollType, setCachedCollType] = useState<CollateralType>(
    CollateralType["ETH-A"]
  );

  return (
    <CacheContext.Provider
      value={{
        setCachedCollType,
        cdpList: cachedCdpList,
        collType: cachedCollType,
        setCachedCdpList: setCachedCdpList,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export default CacheContext;
