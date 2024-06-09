import { type ReactNode, FC } from "react";

import "./NavBar.scss";

interface IProps {
  children: ReactNode;
}

const NavBar: FC<IProps> = ({ children }) => {
  return <div className="nav-bar-wrapper">{children}</div>;
};

export default NavBar;
