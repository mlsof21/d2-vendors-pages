import { useAuth } from '../../hooks/useAuth';
import './logout.scss';

const Logout = () => {
  const { logout } = useAuth();

  logout();
  return <>You have been logged out.</>;
};

export default Logout;
