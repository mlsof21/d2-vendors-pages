export interface Dictionary<T> {
  [Key: string]: T;
}

export const classHashMap: Record<number, string> = {
  3655393761: 'Titan',
  671679327: 'Hunter',
  2271682572: 'Warlock',
};

export const classTypeMap: Record<number, string> = {
  0: 'Titan',
  1: 'Hunter',
  2: 'Warlock',
};

export const orderedClassKeys = [1, 0, 2];

export const vendorHashes: Record<number, string> = {
  350061650: 'Ada-1',
  396892126: 'Devrim',
  248695599: 'Drifter',
  1576276905: 'Failsafe',
  3603221665: 'Shaxx',
  2190858386: 'Xur',
  69482069: 'Zavala',
};

export const statHashes: Record<number, string> = {
  2996146975: 'Mobility',
  392767087: 'Resilience',
  1943323491: 'Recovery',
  1735777505: 'Discipline',
  144602215: 'Intellect',
  4244567218: 'Strength',
};

export const bucketHashes: Record<number, string> = {
  3448274439: 'Helmet',
  3551918588: 'Gauntlets',
  14239492: 'Chest Armor',
  20886954: 'Leg Armor',
  138197802: 'General',
};

export const armorTypes: Record<number, string> = {
  26: 'Helmet',
  27: 'Gauntlets',
  28: 'Chest',
  29: 'Legs',
};

export const intrinsicPlugHash = 1744546145;
