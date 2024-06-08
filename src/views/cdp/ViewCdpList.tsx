import { FC, useContext, useState } from "react";

import GlobalContext from "@/context/GlobalContext";
import { useCdpContract } from "@/hooks/useCdpContract";

import CdpList from "./components/CdpList";
import AppLoader from "@/elements/AppLoader";
import AppButton from "@/elements/AppButton";
import CdpFetcher from "./components/CdpFetcher";
import NoCdpFound from "./components/NoCdpFound";
import { type CollateralType } from "@/types/globalTypes";

const ViewCdp: FC = () => {
  const { cdpContract, ilksContract, provider } = useContext(GlobalContext);
  const [abortController, setAbortController] = useState<AbortController>();
  const {
    error,
    cdpList,
    isLoading,
    totalData,
    loadingProgress,
    fetchCdpListByCollateralType,
    collateralType: cachedCollateralType,
  } = useCdpContract({
    provider: provider!,
    cdpContract: cdpContract!,
    ilksContract: ilksContract!,
  });

  const handleCdpIdChange = async (
    cdpId: string,
    collateralType: CollateralType
  ) => {
    const currentAbortController = new AbortController();
    setAbortController(currentAbortController);

    await fetchCdpListByCollateralType(
      cdpId,
      collateralType,
      currentAbortController.signal
    );

    setAbortController(undefined);
  };

  return (
    <>
      <CdpFetcher
        isDisabled={isLoading}
        handleCdpChange={handleCdpIdChange}
        cachedCollateralType={cachedCollateralType}
      />
      {error && <p className="error">{error.toString()}</p>}
      {isLoading && <AppLoader total={totalData} current={loadingProgress} />}
      {isLoading && abortController && (
        <AppButton
          btnText={"Abort Search"}
          handleClick={() => abortController.abort()}
        />
      )}
      {cdpList.length ? <CdpList cdpList={cdpList} /> : <NoCdpFound />}
    </>
  );
};

export default ViewCdp;
