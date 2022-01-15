export interface Dictionary<T> {
  [Key: string]: T;
}

export const classHashMap: Dictionary<string> = {
  '3655393761': 'Titan',
  '671679327': 'Hunter',
  '2271682572': 'Warlock',
};

export const classTypeMap: Dictionary<string> = {
  0: 'Titan',
  1: 'Hunter',
  2: 'Warlock',
};

export const vendorHashes: Dictionary<string> = {
  350061650: 'Ada-1',
  396892126: 'Devrim',
  248695599: 'Drifter',
  1576276905: 'Failsafe',
  3603221665: 'Shaxx',
  69482069: 'Zavala',
  2190858386: 'Xur',
};

export const statHashes: Dictionary<string> = {
  2996146975: 'Mobility',
  392767087: 'Resilience',
  1943323491: 'Recovery',
  1735777505: 'Discipline',
  144602215: 'Intellect',
  4244567218: 'Strength',
};

export const armorTypes: Dictionary<string> = {
  26: 'Helmet',
  27: 'Gauntlets',
  28: 'Chest Armor',
  29: 'Leg Armor',
};
