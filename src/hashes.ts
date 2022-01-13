export interface Dictionary<T> {
  [Key: string]: T;
}

export const classHashMap: Dictionary<string> = {
  Titan: '3655393761',
  '671679327': 'Hunter',
  '2271682572': 'Warlock',
};

export const vendorHashes: Dictionary<string> = {
  '350061650': 'Ada-1',
  '396892126': 'Devrim',
  '248695599': 'Drifter',
  '1576276905': 'Failsafe',
  '3603221665': 'Shaxx',
  '69482069': 'Zavala',
};

export const statHashes: Dictionary<string> = {
  Intellect: '144602215',
  Resilience: '392767087',
  Discipline: '1735777505',
  Recovery: '1943323491',
  Mobility: '2996146975',
  Strength: '4244567218',
};

export const armorTypes: Dictionary<string> = {
  26: 'Helmet',
  27: 'Gauntlets',
  28: 'Chest Armor',
  29: 'Leg Armor',
};
