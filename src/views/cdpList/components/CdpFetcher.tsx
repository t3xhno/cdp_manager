import { ChangeEvent, FC, useState } from "react";

import "./CdpFetcher.scss";
import { getEnumKeys } from "@utils/helpers";
import { useDebounce } from "@/hooks/useDebounce";
import { CollateralType } from "@/types/globalTypes";

interface IProps {
  isDisabled: boolean;
  cachedCollateralType: CollateralType;
  handleCdpChange: (cdpId: string, collateralType: CollateralType) => void;
}

const CdpFetcher: FC<IProps> = ({
  isDisabled,
  handleCdpChange,
  cachedCollateralType,
}) => {
  const [collateralType, setCollateralType] = useState(cachedCollateralType);

  const handleCollateralTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCollateralType(
      CollateralType[e.target.value as keyof typeof CollateralType]
    );
  };

  const onCdpChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const cdpId = e.target.value;
    e.target.value = "";
    handleCdpChange(cdpId, collateralType);
  };

  const debouncedHandleCdpIdChange = useDebounce(onCdpChange);

  return (
    <div className="cdp-fetcher-wrapper">
      <div className="cdp-fetcher-group">
        <label htmlFor="collateral-type">Collateral type:</label>
        <select
          id="collateral-type"
          name="collateral-type"
          value={collateralType}
          onChange={handleCollateralTypeChange}
        >
          {getEnumKeys(CollateralType).map((collType) => (
            <option
              key={collType}
              value={CollateralType[collType as keyof typeof CollateralType]}
            >
              {collType}
            </option>
          ))}
        </select>
      </div>
      <div className="cdp-fetcher-group">
        <label htmlFor="rough-cdp-id">CDP ID:</label>
        <input
          type="text"
          id="rough-cdp-id"
          name="rough-cdp-id"
          onChange={debouncedHandleCdpIdChange}
          disabled={!collateralType || isDisabled}
        />
      </div>
    </div>
  );
};

export default CdpFetcher;
