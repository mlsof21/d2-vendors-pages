import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getDestinyInventoryItemManifest,
  getMembershipInfo,
  getVendorsForAllCharacters,
} from '../../bungie-api/destiny2-api';
import ItemPopup from '../../components/ItemPopup/ItemPopup';
import Spinner from '../../components/Spinner/Spinner';
import { armorTypes, classTypeMap, orderedClassKeys as classKeys, vendorHashes } from '../../hashes';
import { Armor, getArmorScores, getScorableItems as getScorableArmor, ScorableVendorItems } from '../../scoring/items';
import { getDestinyInventoryItemDefinitionFromStore, storeManifest } from '../../storage/IndexedDB';
import MembershipInfoStorage from '../../storage/MembershipStorage';
import TokenStorage from '../../storage/TokenStorage';
import './vendors.scss';

export interface Position {
  top: number;
  left: number;
}

const Vendors = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(true);
  const [spinnerText, setSpinnerText] = useState('Loading Destiny manifest');
  const [armorScores, setArmorScores] = useState<ScorableVendorItems>();
  const [showNormalized, setShowNormalized] = useState(true);
  const [classMaxes, setClassMaxes] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0 });
  const [classMins, setClassMins] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0 });

  const [orderedClassKeys, setOrderedClassKeys] = useState([...classKeys]);
  const [orderedVendorKeys, setOrderedVendorKeys] = useState([
    350061650, 396892126, 248695599, 1576276905, 3603221665, 2190858386, 69482069,
  ]);
  const [showItemPopup, setShowItemPopup] = useState(false);
  const [itemPopupInfo, setItemPopupInfo] = useState({});
  const [pos, setPos] = useState<Position>({ top: 0, left: 0 });

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
      getCharacterMaxes(scores);
      handleMissingKeys(scores);

      setArmorScores(scores);
    }
    setLoading(false);
  }

  const handleCheckedChange = () => setShowNormalized(!showNormalized);
  const handleCellClicked = (event: React.MouseEvent<HTMLButtonElement>, armorInfo: Armor) => {
    setShowItemPopup(!showItemPopup);
    setItemPopupInfo(armorInfo);
    setPos({ top: event.pageY, left: event.pageX });
    console.log(`Clicked item hash ${armorInfo.itemHash}`);
  };

  const getCharacterMaxes = (scores: ScorableVendorItems) => {
    const vendorHash = parseInt(Object.keys(scores[0])[0]);
    const armorHash = 26;
    const maxes: { [key: number]: number } = {};
    const mins: { [key: number]: number } = {};
    for (let i = 0; i < 3; i++) {
      if (i in scores) {
        if (scores[i][vendorHash][armorHash].theoreticalMax) {
          maxes[i] = scores[i][vendorHash][armorHash].theoreticalMax!;
        }
        if (scores[i][vendorHash][armorHash].theoreticalMin) {
          mins[i] = scores[i][vendorHash][armorHash].theoreticalMin!;
        }
      }
    }

    setClassMaxes(maxes);
    setClassMins(mins);
  };

  const handleMissingKeys = (scores: ScorableVendorItems) => {
    const classes = Object.keys(scores).map((x) => parseInt(x));
    const filteredClasses = orderedClassKeys.filter((x) => classes.includes(x));
    setOrderedClassKeys([...filteredClasses]);
    const vendors = Object.keys(scores[filteredClasses[0]]).map((x) => parseInt(x));
    const filteredVendors = orderedVendorKeys.filter((x) => vendors.includes(x));
    setOrderedVendorKeys([...filteredVendors]);
  };

  return (
    <div>
      {!loading && (
        <label>
          Show Normalized Scores (0-100)
          <input type="checkbox" checked={showNormalized} onChange={handleCheckedChange} />
        </label>
      )}
      {loading && <Spinner text={spinnerText} noOverlay={true} />}
      <div className="vendorTable">
        {armorScores &&
          orderedClassKeys.map((classKey) => (
            <table className="table--flip" key={classKey}>
              <tbody>
                <tr>
                  <th>
                    {classTypeMap[classKey]} {!showNormalized && `(${classMins[classKey]}-${classMaxes[classKey]})`}
                  </th>
                  {orderedVendorKeys.map((vendorKey) => (
                    <th key={vendorKey}>{vendorHashes[vendorKey]}</th>
                  ))}
                </tr>

                {Object.keys(armorTypes)
                  .map((x) => parseInt(x))
                  .map((armorType) => (
                    <tr key={armorType}>
                      <th scope="row">{armorTypes[armorType]}</th>
                      {orderedVendorKeys.map((vendorHash) => {
                        if (!(armorType in armorScores[classKey][vendorHash])) {
                          return <td></td>;
                        }

                        return (
                          <td
                            className="scoreCell"
                            key={vendorHash}
                            style={{
                              backgroundColor: showNormalized
                                ? armorScores[classKey][vendorHash][armorType].colors?.normalizedColorHex
                                : armorScores[classKey][vendorHash][armorType].colors?.colorHex,
                            }}
                          >
                            <button
                              onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                                handleCellClicked(event, armorScores[classKey][vendorHash][armorType])
                              }
                            >
                              {showNormalized
                                ? armorScores[classKey][vendorHash][armorType].normalizedScore
                                : armorScores[classKey][vendorHash][armorType].rawScore}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </tbody>
            </table>
          ))}
        <ItemPopup
          armorInfo={itemPopupInfo}
          show={showItemPopup}
          onClickOutside={() => {
            setShowItemPopup(false);
          }}
          top={pos.top}
          left={pos.left}
        />
      </div>
    </div>
  );
};

export default Vendors;
