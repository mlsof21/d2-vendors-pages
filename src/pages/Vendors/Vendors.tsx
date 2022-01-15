import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getDestinyInventoryItemManifest,
  getMembershipInfo,
  getVendorsForAllCharacters,
} from '../../bungie-api/destiny2-api';
import Spinner from '../../components/Spinner/Spinner';
import { armorTypes, classTypeMap, vendorHashes } from '../../hashes';
import { getArmorScores, getScorableItems as getScorableArmor, ScorableItems } from '../../scoring/items';
import {
  getDestinyInventoryItemDefinitionFromStore,
  getDestinyStatDefinitionFromStore,
  storeManifest,
} from '../../storage/IndexedDB';
import MembershipInfoStorage from '../../storage/Membership';
import TokenStorage from '../../storage/Tokens';
import './vendors.scss';

function Vendors(): ReactElement {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [spinnerText, setSpinnerText] = useState('Loading Destiny manifest');
  const [armorScores, setArmorScores] = useState<ScorableItems>();
  const [showNormalized, setShowNormalized] = useState(true);

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

  let membershipInfo = MembershipInfoStorage.getInstance().getMembershipInfo();

  useEffect(() => {
    getAllData();
    // setLoading(false);
  }, []);

  async function getAllData() {
    // const d2StatDef = await getDestinyStatDefinitionFromStore();
    const d2invItemDef = await getDestinyInventoryItemDefinitionFromStore();
    if (!d2invItemDef) {
      const inventoryItemManifest = await getDestinyInventoryItemManifest();
      setSpinnerText('Storing manifest');
      await storeManifest(inventoryItemManifest);
    }

    if (!membershipInfo) {
      setSpinnerText('Fetching Bungie Member Info');
      membershipInfo = await getMembershipInfo(membershipId);
      membershipInfoStorage.setMembershipInfo(JSON.stringify(membershipInfo));
    }

    if (membershipInfo) {
      setSpinnerText('Fetching Vendor Inventories');
      const allVendors = await getVendorsForAllCharacters(membershipInfo);

      setSpinnerText('Getting scorable armor');
      const scorableArmor = await getScorableArmor(allVendors);

      setSpinnerText('Scoring armor');
      const scores = await getArmorScores(scorableArmor, allVendors);
      setArmorScores(scores);
    }
    setLoading(false);
  }

  const handleCheckedChange = () => setShowNormalized(!showNormalized);

  const orderedClassKeys = [1, 0, 2];
  const orderedVendorKeys = [350061650, 396892126, 248695599, 1576276905, 3603221665, 2190858386, 69482069];

  return (
    <div>
      {!loading && (
        <label>
          Show Normalized Scores
          <input type="checkbox" checked={showNormalized} onChange={handleCheckedChange} />
        </label>
      )}
      {loading && <Spinner text={spinnerText} noOverlay={true} />}
      {armorScores &&
        orderedClassKeys.map((classKey) => (
          <table key={classKey}>
            <tr>
              <th>{classTypeMap[classKey]}</th>
              {orderedVendorKeys.map((vendorKey) => (
                <th key={vendorKey}>{vendorHashes[vendorKey]}</th>
              ))}
            </tr>

            {Object.keys(armorTypes)
              .map((x) => parseInt(x))
              .map((armorType) => (
                <tr key={armorType}>
                  <th scope="row">{armorTypes[armorType]}</th>
                  {orderedVendorKeys.map((vendorHash) => (
                    <td
                      key={vendorHash}
                      style={{
                        backgroundColor: showNormalized
                          ? armorScores[classKey][vendorHash][armorType].colors?.normalizedColorHex
                          : armorScores[classKey][vendorHash][armorType].colors?.colorHex,
                      }}
                    >
                      {showNormalized
                        ? armorScores[classKey][vendorHash][armorType].normalizedScore
                        : armorScores[classKey][vendorHash][armorType].rawScore}
                    </td>
                  ))}
                </tr>
              ))}
          </table>
        ))}
    </div>
  );
}

export default Vendors;
