import { ReactElement } from 'react';
import { useQuery } from '../../hooks';

function Callback(): ReactElement {
  const query = useQuery();

  const authCode = query.get('code');

  return <>{!authCode && <>{authCode}</>}</>;
}

export default Callback;
