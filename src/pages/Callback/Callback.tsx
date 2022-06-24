import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getAccessTokenFromCode } from '../../helpers';
import { useQuery } from '../../hooks';

const Callback = () => {
  const query = useQuery();
  const history = useHistory();

  const authCode = query.get('code');

  useEffect(() => {
    const doThings = async () => {
      await getAccessTokenFromCode(authCode || '');
    };

    doThings();
    history.push('/vendors');
  }, []);

  console.log('Callback:', authCode);
  return <>{!authCode && <>{authCode}</>}</>;
};

export default Callback;
