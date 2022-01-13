import { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import OAuth2Login from 'react-simple-oauth2-login';
import { CLIENT_ID, getAccessTokenFromCode, REDIRECT_URI } from '../../helpers';
import './login.scss';

function Login(): ReactElement {
  const history = useHistory();
  console.log('Using redirect', REDIRECT_URI);

  const onSuccess = async (response: any) => {
    const code = response.code;
    console.log({ code });
    await getAccessTokenFromCode(code);
    history.push('/');
  };

  const onFailure = (response: Response) => console.log(response);

  return (
    <OAuth2Login
      authorizationUrl="https://www.bungie.net/en/Oauth/Authorize"
      responseType="code"
      clientId={CLIENT_ID}
      redirectUri={REDIRECT_URI}
      onSuccess={onSuccess}
      onFailure={onFailure}
      buttonText="Login with Bungie.net Now"
      className="loginButton"
    />
  );
}

export default Login;