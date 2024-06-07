import "./AppButton.scss";
import { FC } from "react";

interface IProps {
  btnText: string;
  handleClick: () => void;
}

const AppButton: FC<IProps> = ({ btnText, handleClick }) => {
  return (
    <button className="btn" onClick={handleClick}>
      {btnText}
    </button>
  );
};

export default AppButton;
