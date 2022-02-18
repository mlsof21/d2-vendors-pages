import { DestinyInventoryItemDefinition, DestinyStat, DestinyVendorsResponse } from 'bungie-api-ts/destiny2';
import { armorTypes, statHashes as statHashesMap, vendorHashes } from '../hashes';
import { BUNGIE_ROOT } from '../helpers';
import { getDestinyInventoryItemDefinitionFromStore } from '../storage/IndexedDB';
import { Colors, getColors, getScores } from './scoring';

export async function getScorableItems(allVendors: {
  [key: number]: DestinyVendorsResponse;
}): Promise<ScorableVendorItems> {
  const classToArmor: ScorableVendorItems = {};

  const classTypes = Object.keys(allVendors).map((x) => parseInt(x));

  const d2inventoryItems = await getDestinyInventoryItemDefinitionFromStore();

  for (const classType of classTypes) {
    classToArmor[classType] = {};

    const availableVendorIds = Object.keys(allVendors[classType].itemComponents).map((x) => parseInt(x));
    const vendorIds = Object.keys(vendorHashes)
      .map((x) => parseInt(x))
      .filter((x) => availableVendorIds.includes(x));
    for (const vendorId of vendorIds) {
      classToArmor[classType][vendorId] = await getArmor(allVendors[classType], vendorId, d2inventoryItems);
    }
  }

  return classToArmor;
}

export interface ScorableVendorItems {
  [classType: number]: VendorArmor;
}

export interface VendorArmor {
  [vendorHash: number]: SaleArmor;
}

export interface SaleArmor {
  [armorType: number]: Armor;
}

export interface Armor {
  saleKey?: number;
  itemHash?: number;
  armorType?: string;
  stats?: ArmorStats;
  rawScore?: number;
  normalizedScore?: number;
  colors?: Colors;
  theoreticalMin?: number;
  theoreticalMax?: number;
  iconPath?: string;
  name?: string;
  scoredStats?: string[];
}

export class ArmorStats {
  public Mobility: number = 0;
  public Resilience: number = 0;
  public Recovery: number = 0;
  public Discipline: number = 0;
  public Intellect: number = 0;
  public Strength: number = 0;

  constructor(init?: Partial<ArmorStats>) {
    Object.assign(this, init);
  }
}

async function getArmor(
  vendors: DestinyVendorsResponse,
  vendorHash: number,
  d2inventoryItems: {
    [key: number]: DestinyInventoryItemDefinition;
  },
): Promise<SaleArmor> {
  const armor: SaleArmor = {};

  if (vendors.sales.data) {
    const saleItemsKeys = Object.keys(vendors.sales.data[vendorHash].saleItems).map((x) => parseInt(x));
    const saleItems = vendors.sales.data[vendorHash].saleItems;
    for (const saleItemKey of saleItemsKeys) {
      const itemHash = saleItems[saleItemKey].itemHash;
      const itemSubType = d2inventoryItems[itemHash].itemSubType;
      const summaryItemHash = d2inventoryItems[itemHash].summaryItemHash!;
      const iconPath = `${BUNGIE_ROOT}${d2inventoryItems[itemHash].displayProperties.icon}`;
      const name = d2inventoryItems[itemHash].displayProperties.name;
      if (isScorable(itemSubType) && summaryItemHash !== 715326750) {
        armor[itemSubType] = {
          itemHash,
          saleKey: saleItemKey,
          armorType: armorTypes[itemSubType],
          iconPath,
          name,
        };
      }
    }
  }

  return armor;
}

export function isScorable(itemSubType: number): boolean {
  const armorTypeHashes = Object.keys(armorTypes).map((x) => parseInt(x));
  return armorTypeHashes.includes(itemSubType);
}

export async function getArmorScores(
  scorableItems: ScorableVendorItems,
  allVendors: { [key: number]: DestinyVendorsResponse },
): Promise<ScorableVendorItems> {
  for (const classType in scorableItems) {
    for (const vendorHash in scorableItems[classType])
      for (const itemSubType in scorableItems[classType][vendorHash]) {
        if (allVendors[classType].itemComponents[vendorHash].stats.data) {
          const saleKey = scorableItems[classType][vendorHash][itemSubType].saleKey!;
          const stats = allVendors[classType].itemComponents[vendorHash].stats.data![saleKey];
          scorableItems[classType][vendorHash][itemSubType].stats = getStats(stats.stats);

          const scores = getScores(scorableItems[classType][vendorHash][itemSubType].stats!, parseInt(classType));
          const colors = getColors(scores);
          scorableItems[classType][vendorHash][itemSubType].rawScore = scores.rawScore;
          scorableItems[classType][vendorHash][itemSubType].normalizedScore = scores.normalizedScore;
          scorableItems[classType][vendorHash][itemSubType].colors = colors;
          scorableItems[classType][vendorHash][itemSubType].theoreticalMax = scores.theoreticalMax;
          scorableItems[classType][vendorHash][itemSubType].theoreticalMin = scores.theoreticalMin;
          scorableItems[classType][vendorHash][itemSubType].scoredStats = scores.scoredStats;
        }
      }
  }
  return scorableItems;
}

function getStats(stats: { [key: number]: DestinyStat }): ArmorStats {
  const armorStats = new ArmorStats();

  for (const statHash in stats) {
    switch (statHashesMap[statHash]) {
      case 'Mobility':
        armorStats.Mobility = stats[statHash].value;
        break;
      case 'Resilience':
        armorStats.Resilience = stats[statHash].value;
        break;
      case 'Recovery':
        armorStats.Recovery = stats[statHash].value;
        break;
      case 'Discipline':
        armorStats.Discipline = stats[statHash].value;
        break;
      case 'Intellect':
        armorStats.Intellect = stats[statHash].value;
        break;
      case 'Strength':
        armorStats.Strength = stats[statHash].value;
        break;
      default:
        throw new Error('No idea what stat this is');
    }
  }

  return armorStats;
}
