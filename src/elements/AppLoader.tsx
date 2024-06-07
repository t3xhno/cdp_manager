import "./AppLoader.scss";
import { FC } from "react";

interface IProps {
  total: number;
  current: number;
}

const AppLoader: FC<IProps> = ({ total, current }) => {
  return (
    <div className="loader-wrapper">
      <div
        className="progress"
        style={{ width: `${(current / total) * 100}%` }}
      />
      <p>
        Loading... {current}/{total}
      </p>
    </div>
  );
};

export default AppLoader;
