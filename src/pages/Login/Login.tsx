import OAuth2Login from 'react-simple-oauth2-login';
import { CLIENT_ID, REDIRECT_URI } from '../../helpers';
import { useAuth } from '../../hooks/useAuth';
import './login.scss';

interface LoginProps {
  handleAuth: () => void;
}

const Login = () => {
  const { login } = useAuth();

  const onFailure = (response: Response) => {
    console.error(response);
    throw Error("Couldn't login");
  };

  return (
    <OAuth2Login
      authorizationUrl="https://www.bungie.net/en/Oauth/Authorize"
      responseType="code"
      clientId={CLIENT_ID}
      redirectUri={REDIRECT_URI}
      onSuccess={login}
      onFailure={onFailure}
      buttonText="Login with Bungie.net"
      className="loginButton"
    />
  );
};

export default Login;
