import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import TokenStorage from '../../storage/Tokens';
import './nav.scss';

function Nav(): ReactElement {
  const isAuthorized = TokenStorage.getInstance().getAllTokens();
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      {!isAuthorized && <Link to="/login">Login</Link>}
      {isAuthorized && <Link to="/vendors">Vendors</Link>}
    </div>
  );
}

export default Nav;
