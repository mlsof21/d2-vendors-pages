import tinygradient from 'tinygradient';
import { statHashes, subgroup1Hashes, subgroup2Hashes } from '../hashes';
import ScoringStorage from '../storage/ScoringStorage';

// export class ArmorScoring {
//   public Mobility: number = 0;
//   public Resilience: number = 0;
//   public Recovery: number = 0;
//   public Discipline: number = 0;
//   public Intellect: number = 0;
//   public Strength: number = 0;

//   constructor(init?: Partial<ArmorScoring>) {
//     Object.assign(this, init);
//   }

//   getSortedSubGroup1(): number[] {
//     return [this.Mobility, this.Resilience, this.Recovery].sort((a, b) => b - a);
//   }

//   getSortedSubGroup2(): number[] {
//     return [this.Discipline, this.Intellect, this.Strength].sort((a, b) => b - a);
//   }
// }

export interface Score {
  rawScore: number;
  normalizedScore: number;
  theoreticalMax: number;
  theoreticalMin: number;
  scoredStats: string[];
}

export interface Colors {
  colorHex: string;
  normalizedColorHex: string;
}

export function getScores(armorStats: Record<number, number>, classType: number): Score {
  const scoring = getScoring(classType);
  const scoredStats = getScoredStats(scoring);
  const rawScore = getRawScore(armorStats, scoring);
  const theoreticalMin = getTheoreticalMin(scoring);
  const theoreticalMax = getTheoreticalMax(scoring);
  const normalizedScore = getNormalizedScore(rawScore, theoreticalMin, theoreticalMax);

  return { rawScore, normalizedScore, theoreticalMax, theoreticalMin, scoredStats };
}

export function getScoredStats(scoring: Record<number, number>): string[] {
  const scoredStats = [];

  for (const stat in scoring) {
    scoredStats.push(statHashes[stat]);
  }

  return scoredStats;
}

export function getRawScore(armorStats: Record<number, number>, scoring: Record<number, number>): number {
  let score = 0;
  for (const stat in scoring) {
    score += armorStats[stat] * scoring[stat];
  }
  return score;
}

export function getNormalizedScore(score: number, theoreticalMin: number, theoreticalMax: number): number {
  return Math.round(((score - theoreticalMin) / Math.max(theoreticalMax - theoreticalMin, 1)) * 100);
}

export function getColors(score: Score): Colors {
  const gradient = tinygradient(['#FF0000', '#00FF00']);
  const colorsRgb = gradient.rgb(Math.max(score.theoreticalMax - score.theoreticalMin, 2));
  const colorHex = colorsRgb[Math.max(score.rawScore - score.theoreticalMin - 1, 0)].toHexString();
  const colorsRgbNormalized = gradient.rgb(100);
  const normalizedColorHex = colorsRgbNormalized[Math.max(score.normalizedScore - 1, 0)].toHexString();

  return { colorHex, normalizedColorHex };
}

function getScoring(classType: number): Record<number, number> {
  const scoringStorage = ScoringStorage.getInstance();

  switch (classType) {
    case 0:
      return getTitanScoring(scoringStorage);
    case 1:
      return getHunterScoring(scoringStorage);
    case 2:
      return getWarlockScoring(scoringStorage);
  }
  return {};
}

function getTitanScoring(scoringStorage: ScoringStorage): Record<number, number> {
  const storedScoring = scoringStorage.getScoring();
  if (storedScoring) {
    return storedScoring[0];
  }
  return getDefaultTitanScoring();
}

function getHunterScoring(scoringStorage: ScoringStorage): Record<number, number> {
  const storedScoring = scoringStorage.getScoring();
  if (storedScoring) {
    return storedScoring[1];
  }
  return getDefaultHunterScoring();
}

function getWarlockScoring(scoringStorage: ScoringStorage): Record<number, number> {
  const storedScoring = scoringStorage.getScoring();
  if (storedScoring) {
    return storedScoring[2];
  }
  return getDefaultWarlockScoring();
}

export function getDefaultTitanScoring(): Record<number, number> {
  return { 1943323491: 3, 1735777505: 2, 392767087: 1 };
}

export function getDefaultHunterScoring(): Record<number, number> {
  return { 1943323491: 3, 1735777505: 2, 2996146975: 1 };
}

export function getDefaultWarlockScoring(): Record<number, number> {
  return { 1943323491: 3, 1735777505: 3 };
}

export function getDefaultScoring(): Record<number, number> {
  return { 2996146975: 1, 392767087: 1, 1943323491: 1, 1735777505: 1, 144602215: 1, 4244567218: 1 };
}

export function getTheoreticalMin(armorScoring: Record<number, number>): number {
  // per subgroup: highest weighting * lowest stat + medium weighting * medium stat + smallest weighting * highest stat

  const sortedSubGroup1 = getSortedSubGroup(armorScoring, subgroup1Hashes);
  const sortedSubGroup2 = getSortedSubGroup(armorScoring, subgroup2Hashes);

  const plugs = [
    [2, 10, 10],
    [2, 2, 20],
  ];

  let min = Number.MAX_VALUE;
  for (const plug of plugs) {
    let subgroup1Score = 0;
    let subgroup2Score = 0;
    for (let i = 0; i < 3; i++) {
      subgroup1Score += sortedSubGroup1[i] * plug[i];
      subgroup2Score += sortedSubGroup2[i] * plug[i];
    }

    if (subgroup1Score + subgroup2Score < min) min = subgroup1Score + subgroup2Score;
  }

  return min;
}

export function getTheoreticalMax(armorScoring: Record<number, number>): number {
  const maxStatPossible = 30;
  const minStatPossible = 2;

  const sortedSubGroup1 = getSortedSubGroup(armorScoring, subgroup1Hashes);
  const sortedSubGroup2 = getSortedSubGroup(armorScoring, subgroup2Hashes);

  return (
    maxStatPossible * (sortedSubGroup1[0] + sortedSubGroup2[0]) +
    minStatPossible * (sortedSubGroup1[1] + sortedSubGroup1[2] + sortedSubGroup2[1] + sortedSubGroup2[2])
  );
}

export function getSortedSubGroup(armorScoring: Record<number, number>, subgroup: number[]): number[] {
  const sorted = [];
  for (const stat in armorScoring) {
    if (subgroup.includes(parseInt(stat))) sorted.push(armorScoring[stat]);
  }

  if (sorted.length < 3) {
    sorted.fill(0, sorted.length, 2);
  }
  return sorted.sort((a, b) => b - a);
}
