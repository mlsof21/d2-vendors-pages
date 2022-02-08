import _ from 'lodash';
import { CharacterItem } from '../../scoring/inventory';
import CharacterArmor from '../CharacterArmor/CharacterArmor';
import './armorStore.scss';

export interface ArmorStoreProps {
  inventoryItems: CharacterItem[];
  equippedItems: CharacterItem[];
  vaultItems: CharacterItem[];
}

const ArmorStore = ({ inventoryItems }: ArmorStoreProps) => {
  const itemsByBucket = _.groupBy(inventoryItems, (item) => item.item.item.bucketHash);
  return (
    <div>
      {Object.keys(itemsByBucket)
        .map((x) => parseInt(x))
        .map((bucket) => (
          <CharacterArmor key={bucket} inventoryItems={itemsByBucket[bucket]} />
        ))}
    </div>
  );
};

function getByInventoryBucket(items: CharacterItem[]): Record<number, CharacterItem[]> {
  const itemByBucket: Record<number, CharacterItem[]> = {};
  for (const item of items) {
    const bucketHash = item.item.item.bucketHash;
    if (!(bucketHash in itemByBucket)) {
      itemByBucket[bucketHash] = [];
    }
    itemByBucket[bucketHash].push(item);
  }

  return itemByBucket;
}

export default ArmorStore;
