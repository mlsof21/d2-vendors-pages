import { useQuery } from '../../hooks';

const Callback = () => {
  const query = useQuery();

  const authCode = query.get('code');

  return <>{!authCode && <>{authCode}</>}</>;
};

export default Callback;
