import { DestinyInventoryItemDefinition, DestinyStat, DestinyVendorsResponse } from 'bungie-api-ts/destiny2';
import { armorTypes, statHashes as statHashesMap, vendorHashes } from '../hashes';
import { getDestinyInventoryItemDefinitionFromStore } from '../storage/IndexedDB';

const nameof = <T>(name: Extract<keyof T, string>): string => name;

export async function getScorableItems(allVendors: { [key: number]: DestinyVendorsResponse }): Promise<ScorableItems> {
  const classToArmor: ScorableItems = {};

  const classTypes = Object.keys(allVendors).map((x) => parseInt(x));

  console.time('getDestinyInventoryItemDefinitionFromStore');
  console.timeLog('getDestinyInventoryItemDefinitionFromStore');
  const d2inventoryItems = await getDestinyInventoryItemDefinitionFromStore();
  console.timeEnd('getDestinyInventoryItemDefinitionFromStore');

  console.time('getScorableItems');
  console.timeLog('getScorableItems');
  for (const classType of classTypes) {
    classToArmor[classType] = {};
    const vendorIds = Object.keys(vendorHashes).map((x) => parseInt(x));
    for (const vendorId of vendorIds) {
      classToArmor[classType][vendorId] = await getArmor(allVendors[classType], vendorId, d2inventoryItems);
    }
  }
  console.timeEnd('getScorableItems');

  return classToArmor;
}

export interface ScorableItems {
  [classType: number]: VendorArmor;
}

export interface VendorArmor {
  [vendorHash: number]: SaleArmor;
}

export interface SaleArmor {
  [saleKey: number]: {
    itemHash?: number;
    armorType?: string;
    stats?: ArmorStats;
    rawScore?: number;
    normalizedScore?: number;
  };
}

export interface Armor {
  itemHash?: number;
  armorType?: string;
  stats?: ArmorStats;
  rawScore?: number;
  normalizedScore?: number;
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

export class ArmorScoring {
  public Mobility: number = 0;
  public Resilience: number = 0;
  public Recovery: number = 0;
  public Discipline: number = 0;
  public Intellect: number = 0;
  public Strength: number = 0;

  constructor(init?: Partial<ArmorScoring>) {
    Object.assign(this, init);
  }

  getSortedSubGroup1(): number[] {
    return [this.Mobility, this.Resilience, this.Recovery].sort((a, b) => b - a);
  }

  getSortedSubGroup2(): number[] {
    return [this.Discipline, this.Intellect, this.Strength].sort((a, b) => b - a);
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

  console.time(`getArmor ${vendorHash}`);
  console.timeLog(`getArmor ${vendorHash}`);
  if (vendors.sales.data) {
    const saleItemsKeys = Object.keys(vendors.sales.data[vendorHash].saleItems).map((x) => parseInt(x));
    const saleItems = vendors.sales.data[vendorHash].saleItems;
    for (const saleItemKey of saleItemsKeys) {
      const itemHash = saleItems[saleItemKey].itemHash;
      const itemSubType = d2inventoryItems[itemHash].itemSubType;
      const summaryItemHash = d2inventoryItems[itemHash].summaryItemHash!;
      if (isScorable(itemSubType) && summaryItemHash !== 715326750) {
        armor[saleItemKey] = { itemHash, armorType: armorTypes[itemSubType] };
      }
    }
  }
  console.timeEnd(`getArmor ${vendorHash}`);

  return armor;
}

function isScorable(itemSubType: number): boolean {
  const armorTypeHashes = Object.keys(armorTypes).map((x) => parseInt(x));
  return armorTypeHashes.includes(itemSubType);
}

export async function getArmorScores(
  scorableItems: ScorableItems,
  allVendors: { [key: number]: DestinyVendorsResponse },
) {
  for (const classType in scorableItems) {
    for (const vendorHash in scorableItems[classType])
      for (const saleKey in scorableItems[classType][vendorHash]) {
        if (allVendors[classType].itemComponents[vendorHash].stats.data) {
          const stats = allVendors[classType].itemComponents[vendorHash].stats.data![saleKey];
          scorableItems[classType][vendorHash][saleKey].stats = getStats(stats.stats);

          const scores = getScores(scorableItems[classType][vendorHash][saleKey].stats!, parseInt(classType));
          scorableItems[classType][vendorHash][saleKey].rawScore = scores.rawScore;
          scorableItems[classType][vendorHash][saleKey].normalizedScore = scores.normalizedScore;
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

function getScores(armorStats: ArmorStats, classType: number): { rawScore: number; normalizedScore: number } {
  const scoring = getScoring(classType);
  const rawScore = getRawScore(armorStats, scoring);
  const normalizedScore = getNormalizedScore(rawScore, getTheoreticalMax(scoring));

  return { rawScore, normalizedScore };
}

export function getRawScore(armorStats: ArmorStats, scoring: ArmorScoring): number {
  let score = 0;
  score += armorStats.Mobility * scoring.Mobility;
  score += armorStats.Resilience * scoring.Resilience;
  score += armorStats.Recovery * scoring.Recovery;
  score += armorStats.Discipline * scoring.Discipline;
  score += armorStats.Intellect * scoring.Intellect;
  score += armorStats.Strength * scoring.Strength;
  return score;
}

export function getNormalizedScore(score: number, theoreticalMax: number): number {
  return Math.round((score / theoreticalMax) * 100);
}

function getScoring(classType: number): ArmorScoring {
  switch (classType) {
    case 0:
      return getTitanScoring();
    case 1:
      return getHunterScoring();
    case 2:
      return getWarlockScoring();
  }
  return new ArmorScoring();
}

function getTitanScoring(): ArmorScoring {
  return new ArmorScoring({ Recovery: 3, Discipline: 2, Resilience: 1 });
}

function getHunterScoring(): ArmorScoring {
  return new ArmorScoring({ Recovery: 3, Discipline: 2, Mobility: 1 });
}

function getWarlockScoring(): ArmorScoring {
  return new ArmorScoring({ Recovery: 3, Discipline: 3 });
}

export function getTheoreticalMax(armorScoring: ArmorScoring) {
  const maxStatPossible = 30;
  const minStatPossible = 2;

  const sortedSubGroup1 = armorScoring.getSortedSubGroup1();
  const sortedSubGroup2 = armorScoring.getSortedSubGroup2();

  return (
    maxStatPossible * (sortedSubGroup1[0] + sortedSubGroup2[0]) +
    minStatPossible * (sortedSubGroup1[1] + sortedSubGroup1[2] + sortedSubGroup2[1] + sortedSubGroup2[2])
  );
}
