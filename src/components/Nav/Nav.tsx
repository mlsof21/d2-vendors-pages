import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import './nav.scss';

export interface NavProps {
  isAuthorized: boolean;
}

function Nav(props: NavProps): ReactElement {
  const { isAuthorized } = props;

  return (
    <div className="navbar">
      {!isAuthorized && <Link to="/login">Login</Link>}
      {isAuthorized && <Link to="/vendors">Vendors</Link>}
      {<Link to="/settings">Settings</Link>}
    </div>
  );
}

export default Nav;
