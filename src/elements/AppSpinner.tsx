import { FC } from "react";

import "./AppSpinner.scss";

interface IProps {
  size?: number;
}

const AppSpinner: FC<IProps> = ({ size = 2 }) => {
  return (
    <div
      className="spinner-wrapper"
      style={{
        borderRadius: "50%",
        width: `${size}rem`,
        height: `${size}rem`,
        borderStyle: "solid",
        borderColor: "transparent",
        borderTopColor: "#40753d",
        borderWidth: `${size / 10}rem`,
        animation: "spin 0.5s linear infinite",
      }}
    />
  );
};

export default AppSpinner;
