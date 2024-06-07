import { createContext, FC, ReactNode, useState } from "react";
import { type ExtendedICdp, type ICachedContext } from "@/types/globalTypes";

const CacheContext = createContext<ICachedContext>({
  cdpList: [],
  setCachedCdpList: () => {},
});

interface IProps {
  children: ReactNode;
}

export const CacheProvider: FC<IProps> = ({ children }) => {
  const [cachedCdpList, setCachedCdpList] = useState<ExtendedICdp[]>();

  return (
    <CacheContext.Provider
      value={{ cdpList: cachedCdpList, setCachedCdpList: setCachedCdpList }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export default CacheContext;
