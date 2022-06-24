import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CLIENT_ID, getAccessTokenFromCode } from '../../helpers';
import './login.scss';

interface LoginProps {
  handleAuth: () => void;
}

const Login = ({ handleAuth }: LoginProps) => {
  const history = useHistory();

  const onSuccess = async (response: any) => {
    const code = response.code;
    handleAuth();
    await getAccessTokenFromCode(code);
    history.push('/vendors');
  };

  const onFailure = (response: Response) => console.log(response);

  const getAuthorizationUrl = () => {
    const queryParams = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'code',
      state: uuidv4(),
    });

    return `https://www.bungie.net/en/OAuth/authorize?${queryParams}`;
  };
  return (
    <a rel="noopener noreferer" href={getAuthorizationUrl()} className="loginButton">
      Login with Bungie.net
    </a>
  );
};

export default Login;
