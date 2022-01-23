import { Link } from 'react-router-dom';
import './nav.scss';

type NavProps = {
  isAuthorized: boolean;
};

const Nav = ({ isAuthorized }: NavProps) => {
  return (
    <div className="navbar">
      {!isAuthorized && <Link to="/login">Login</Link>}
      {isAuthorized && <Link to="/vendors">Vendors</Link>}
      {<Link to="/settings">Settings</Link>}
    </div>
  );
};

export default Nav;
