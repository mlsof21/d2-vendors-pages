import { ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getDestinyInventoryItemManifest, getMembershipInfo } from '../../bungie-api/destiny2-api';
import MembershipInfoStorage from '../../storage/Membership';
import TokenStorage from '../../storage/Tokens';

function Home(): ReactElement {
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  const tokenStorage = TokenStorage.getInstance();
  const membershipInfoStorage = MembershipInfoStorage.getInstance();

  const tokens = tokenStorage.getAllTokens();
  let membershipId = '';

  if (!tokens) {
    console.info('Redirecting to Login');
    history.push('/Login');
    return <></>;
  }
  if (tokens) membershipId = tokens?.bungieMembershipId;

  let membershipInfo = membershipInfoStorage.getMembershipInfo();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const inventoryItemManifest = await getDestinyInventoryItemManifest();

    if (!membershipInfo) {
      membershipInfo = await getMembershipInfo(membershipId);
      membershipInfoStorage.setMembershipInfo(JSON.stringify(membershipInfo));
    }

    setLoading(false);
  }

  if (loading) {
    return <>Loading User Info</>;
  }

  return <>This is the Home page</>;
}

export default Home;
