export interface VendorArmor {
  hunter: Vendor;
  titan: Vendor;
  warlock: Vendor;
  notableArmor: NotableArmor[];
  expiresAt: number;
}

export interface Vendor {
  ada1: Armor;
  devrim: Armor;
  failsafe: Armor;
  shaxx: Armor;
  zavala: Armor;
}

export interface Armor {
  helmet: ArmorScore;
  gauntlets: ArmorScore;
  chestArmor: ArmorScore;
  legArmor: ArmorScore;
}

export interface ArmorScore {
  score: number;
  color: string;
}

export interface NotableArmor {
  vendor: string;
  character: string;
  armor: string;
  notableStats: string[];
}
