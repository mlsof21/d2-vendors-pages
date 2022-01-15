import { ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getDestinyInventoryItemManifest, getMembershipInfo } from '../../bungie-api/destiny2-api';
import Spinner from '../../components/Spinner/Spinner';
import {
  getDestinyInventoryItemDefinitionFromStore,
  getDestinyStatDefinitionFromStore,
  storeManifest,
} from '../../storage/IndexedDB';
import MembershipInfoStorage from '../../storage/Membership';
import TokenStorage from '../../storage/Tokens';

function Home(): ReactElement {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [spinnerText, setSpinnerText] = useState('Loading Destiny manifest');

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
    const d2StatDef = await getDestinyStatDefinitionFromStore();
    const d2invItemDef = await getDestinyInventoryItemDefinitionFromStore();
    if (!d2StatDef || !d2invItemDef) {
      const inventoryItemManifest = await getDestinyInventoryItemManifest();
      setSpinnerText('Storing manifest');
      await storeManifest(inventoryItemManifest);
    }
    if (!membershipInfo) {
      setSpinnerText('Fetching Bungie Member Info');
      membershipInfo = await getMembershipInfo(membershipId);
      membershipInfoStorage.setMembershipInfo(JSON.stringify(membershipInfo));
    }

    setLoading(false);
  }

  if (loading) {
    return <Spinner text={spinnerText} noOverlay={true} />;
  }

  return <>This is the home page</>;
}

export default Home;
