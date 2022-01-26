import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './nav.scss';

const Nav = () => {
  const { auth } = useAuth();
  return (
    <div className="navbar">
      {!auth && <Link to="/login">Login</Link>}
      {auth && <Link to="/vendors">Vendors</Link>}
      {auth && <Link to="/inventory">Inventory</Link>}
      {<Link to="/settings">Settings</Link>}
      {auth && <Link to="/logout">Logout</Link>}
    </div>
  );
};

export default Nav;
