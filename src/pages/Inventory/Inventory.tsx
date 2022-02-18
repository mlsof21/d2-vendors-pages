import { useEffect, useState } from 'react';
import { getVaultInventory as getInventories } from '../../bungie-api/destiny2-api';
import ArmorStore from '../../components/ArmorStore/ArmorStore';
import Spinner from '../../components/Spinner/Spinner';
import { CharacterItem, getScoredInventories } from '../../scoring/inventory';
import MembershipInfoStorage from '../../storage/MembershipStorage';
import './inventory.scss';

const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [spinnerText, setSpinnerText] = useState('Fetching Character Inventories');
  const [vaultItems, setVaultItems] = useState<Record<number, CharacterItem[]>>([]);
  const [equippedItems, setEquippedItems] = useState<Record<number, CharacterItem[]>>([]);
  const [inventoryItems, setInventoryItems] = useState<Record<number, CharacterItem[]>>([]);

  const membershipInfo = MembershipInfoStorage.getInstance().getMembershipInfo();
  useEffect(() => {
    getAllData();
  });

  async function getAllData() {
    if (membershipInfo) {
      const inventories = await getInventories(membershipInfo.destinyMembershipId, membershipInfo.membershipType);
      setSpinnerText('Scoring Inventory Items');
      const { scoredVaultItems, scoredEquippedItems, scoredInventoryItems } = await getScoredInventories(inventories);
      setLoading(false);
      setVaultItems(scoredVaultItems);
      setInventoryItems(scoredInventoryItems);
      setEquippedItems(scoredEquippedItems);
    }
  }

  return (
    <div>
      {loading && <Spinner text={spinnerText} noOverlay={true} />}
      <div className="stores">
        {Object.keys(inventoryItems)
          .map((x) => parseInt(x))
          .map((armorType) => (
            <ArmorStore
              key={armorType}
              inventoryItems={inventoryItems[armorType]}
              equippedItems={equippedItems[armorType]}
              vaultItems={vaultItems[armorType]}
            />
          ))}
      </div>
    </div>
  );
};

export default Inventory;
