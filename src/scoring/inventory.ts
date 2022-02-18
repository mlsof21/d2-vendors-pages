import {
  DestinyInventoryComponent,
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  DestinyItemInstanceComponent,
  DestinyItemSocketsComponent,
  DestinyProfileResponse,
} from 'bungie-api-ts/destiny2';
import { armorTypes, bucketHashes, intrinsicPlugHash, statHashes } from '../hashes';
import { getDestinyInventoryItemDefinitionFromStore } from '../storage/IndexedDB';
import MembershipStorage from '../storage/MembershipStorage';
import ScoringStorage from '../storage/ScoringStorage';
import { ArmorScoring, getDefaultHunterScoring, getDefaultTitanScoring, getDefaultWarlockScoring } from './scoring';

export async function getScoredInventories(inventories: DestinyProfileResponse) {
  const d2inventoryItems = await getDestinyInventoryItemDefinitionFromStore();
  const scorableVaultItems = getScorableVaultItems(inventories.profileInventory.data?.items, d2inventoryItems);
  const scorableEquippedItems = getScorableInventoryItems(inventories.characterEquipment.data, d2inventoryItems);
  const scorableInventoryItems = getScorableInventoryItems(inventories.characterInventories.data, d2inventoryItems);
  let armorScoring = ScoringStorage.getInstance().getScoring();
  if (!armorScoring) {
    armorScoring = { 0: getDefaultTitanScoring(), 1: getDefaultHunterScoring(), 2: getDefaultWarlockScoring() };
  }

  const scoredVaultItems = getScoredItems(
    scorableVaultItems,
    inventories.itemComponents.sockets.data,
    inventories.itemComponents.instances.data,
    d2inventoryItems,
    armorScoring,
  );

  const scoredEquippedItems = getScoredItems(
    scorableEquippedItems,
    inventories.itemComponents.sockets.data,
    inventories.itemComponents.instances.data,
    d2inventoryItems,
    armorScoring,
  );

  const scoredInventoryItems = getScoredItems(
    scorableInventoryItems,
    inventories.itemComponents.sockets.data,
    inventories.itemComponents.instances.data,
    d2inventoryItems,
    armorScoring,
  );

  return { scoredVaultItems, scoredEquippedItems, scoredInventoryItems };
}

interface ScorableItem {
  item: DestinyItemComponent;
  itemDef: DestinyInventoryItemDefinition;
}

export function getScorableVaultItems(
  items: DestinyItemComponent[] | undefined,
  d2inventoryItems: {
    [key: number]: DestinyInventoryItemDefinition;
  },
) {
  const scorableItems: ScorableItem[] = [];
  const armorBucketHashes = Object.keys(bucketHashes).map((x) => parseInt(x));
  const subTypes = Object.keys(armorTypes).map((x) => parseInt(x));

  if (items) {
    for (const item of items) {
      if (armorBucketHashes.includes(item.bucketHash)) {
        const itemDef = d2inventoryItems[item.itemHash];
        if (subTypes.includes(itemDef.itemSubType)) scorableItems.push({ item, itemDef });
      }
    }
  }
  return scorableItems;
}

function getScorableInventoryItems(
  characterEquipment: { [key: string]: DestinyInventoryComponent } | undefined,
  d2inventoryItems: {
    [key: number]: DestinyInventoryItemDefinition;
  },
) {
  const scorableItems: ScorableItem[] = [];
  const armorBucketHashes = Object.keys(bucketHashes).map((x) => parseInt(x));

  for (const character in characterEquipment) {
    for (const item of characterEquipment[character].items) {
      if (armorBucketHashes.includes(item.bucketHash)) {
        const itemDef = d2inventoryItems[item.itemHash];
        scorableItems.push({ item, itemDef });
      }
    }
  }
  return scorableItems;
}

function getClassType(character: string) {
  const membershipInfo = MembershipStorage.getInstance().getMembershipInfo();
  if (character === membershipInfo?.titanId) {
    return 0;
  }
  if (character === membershipInfo?.hunterId) {
    return 1;
  }
  if (character === membershipInfo?.warlockId) {
    return 2;
  }

  return 3;
}

export interface CharacterItem {
  item: ScorableItem;
  itemInstance: DestinyItemInstanceComponent;
  stats: Record<number, number>;
  score: number;
}

function getScoredItems(
  scorableItems: ScorableItem[],
  socketData:
    | {
        [key: string]: DestinyItemSocketsComponent;
      }
    | undefined,
  instanceData: { [key: string]: DestinyItemInstanceComponent } | undefined,
  d2inventoryItems: { [key: string]: DestinyInventoryItemDefinition },
  armorScoring: { [classKey: number]: ArmorScoring },
) {
  const itemStats: Record<number, CharacterItem[]> = {};
  if (socketData) {
    for (const item of scorableItems) {
      let itemInstance;
      const stats: Record<number, number> = {
        2996146975: 0,
        392767087: 0,
        1943323491: 0,
        1735777505: 0,
        144602215: 0,
        4244567218: 0,
      };
      if (item.item.itemInstanceId) {
        if (instanceData) itemInstance = instanceData[item.item.itemInstanceId];
        if (item.item.itemInstanceId in socketData) {
          const sockets = socketData[item.item.itemInstanceId].sockets;
          for (const socket of sockets) {
            const plugHash = socket.plugHash;
            if (plugHash) {
              const plug = d2inventoryItems[plugHash];
              if (plug.plug && plug.plug.plugCategoryHash === intrinsicPlugHash) {
                for (const stat of plug.investmentStats) {
                  stats[stat.statTypeHash] += stat.value;
                }
              }
            }
          }
        }
      }
      if (itemInstance) {
        const classType = item.itemDef.classType;
        // const otherScore = getArmorScores();
        const score = getInventoryScore(stats, armorScoring[classType]);
        const itemSubType = d2inventoryItems[item.item.itemHash].itemSubType;
        if (!(itemSubType in itemStats)) {
          itemStats[itemSubType] = [];
        }
        itemStats[itemSubType].push({ item, itemInstance, stats, score });
      }
    }
  }
  return itemStats;
}

function getInventoryScore(stats: Record<number, number>, armorScoring: ArmorScoring) {
  const scoring = getHashedScoring(armorScoring);
  let score = 0;
  for (const stat in stats) {
    score += stats[stat] * scoring[stat];
  }

  return score;
}

function getHashedScoring(armorScoring: ArmorScoring) {
  const scoring: Record<number, number> = {};

  const mobility = getKeyByValue(statHashes, 'Mobility');
  if (mobility) scoring[mobility] = armorScoring.Mobility;

  const resilience = getKeyByValue(statHashes, 'Resilience');
  if (resilience) scoring[resilience] = armorScoring.Resilience;

  const recovery = getKeyByValue(statHashes, 'Recovery');
  if (recovery) scoring[recovery] = armorScoring.Recovery;

  const discipline = getKeyByValue(statHashes, 'Discipline');
  if (discipline) scoring[discipline] = armorScoring.Discipline;

  const intellect = getKeyByValue(statHashes, 'Intellect');
  if (intellect) scoring[intellect] = armorScoring.Intellect;

  const strength = getKeyByValue(statHashes, 'Strength');
  if (strength) scoring[strength] = armorScoring.Strength;

  return scoring;
}

//TODO: this shouldn't be necessary, need to store scoring as statHashes
function getKeyByValue(object: any, value: any): number | undefined {
  return Object.keys(object)
    .map((x) => parseInt(x))
    .find((key) => object[key] === value);
}
