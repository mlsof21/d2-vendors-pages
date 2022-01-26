import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAccessTokenFromCode } from '../helpers';
import TokenStorage from '../storage/Tokens';

export function useAuth() {
  const [auth, setAuth] = useState(false);
  const history = useHistory();
  const tokenStorage = TokenStorage.getInstance();

  useEffect(() => {
    const tokens = tokenStorage.getAllTokens();
    if (tokens) {
      setAuth(true);
    }
  }, [setAuth]);

  const login = async (response: any) => {
    const code = response.code;
    await getAccessTokenFromCode(code);
    setAuth(true);
    history.push('/vendors');
  };

  const logout = async () => {
    tokenStorage.clear();
    setAuth(false);
  };

  return { auth, login, logout };
}
