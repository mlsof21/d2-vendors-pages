import tinygradient from 'tinygradient';
import ScoringStorage from '../storage/Scoring';
import { ArmorStats } from './items';

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

export interface Score {
  rawScore: number;
  normalizedScore: number;
  theoreticalMax: number;
  theoreticalMin: number;
}

export interface Colors {
  colorHex: string;
  normalizedColorHex: string;
}

export function getScores(armorStats: ArmorStats, classType: number): Score {
  const scoring = getScoring(classType);
  const rawScore = getRawScore(armorStats, scoring);
  const theoreticalMin = getTheoreticalMin(scoring);
  const theoreticalMax = getTheoreticalMax(scoring);
  const normalizedScore = getNormalizedScore(rawScore, theoreticalMin, theoreticalMax);

  return { rawScore, normalizedScore, theoreticalMax, theoreticalMin };
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

export function getNormalizedScore(score: number, theoreticalMin: number, theoreticalMax: number): number {
  return Math.round(((score - theoreticalMin) / (theoreticalMax - theoreticalMin)) * 100);
}

export function getColors(score: Score): Colors {
  const gradient = tinygradient(['#FF0000', '#00FF00']);
  const colorsRgb = gradient.rgb(score.theoreticalMax > 0 ? score.theoreticalMax : 1);
  const colorHex = colorsRgb[score.rawScore].toHexString();
  const colorsRgbNormalized = gradient.rgb(100);
  const normalizedColorHex = colorsRgbNormalized[score.normalizedScore - 1].toHexString();

  return { colorHex, normalizedColorHex };
}

function getScoring(classType: number): ArmorScoring {
  const scoringStorage = ScoringStorage.getInstance();

  switch (classType) {
    case 0:
      return getTitanScoring(scoringStorage);
    case 1:
      return getHunterScoring(scoringStorage);
    case 2:
      return getWarlockScoring(scoringStorage);
  }
  return new ArmorScoring();
}

function getTitanScoring(scoringStorage: ScoringStorage): ArmorScoring {
  const storedScoring = scoringStorage.getScoring();
  if (storedScoring) {
    return new ArmorScoring(storedScoring[0]);
  }
  return getDefaultTitanScoring();
}

function getHunterScoring(scoringStorage: ScoringStorage): ArmorScoring {
  const storedScoring = scoringStorage.getScoring();
  if (storedScoring) {
    return new ArmorScoring(storedScoring[1]);
  }
  return getDefaultHunterScoring();
}

function getWarlockScoring(scoringStorage: ScoringStorage): ArmorScoring {
  const storedScoring = scoringStorage.getScoring();
  if (storedScoring) {
    return new ArmorScoring(storedScoring[2]);
  }
  return getDefaultWarlockScoring();
}

export function getDefaultTitanScoring(): ArmorScoring {
  return new ArmorScoring({ Recovery: 3, Discipline: 2, Resilience: 1 });
}

export function getDefaultHunterScoring(): ArmorScoring {
  return new ArmorScoring({ Recovery: 3, Discipline: 2, Mobility: 1 });
}

export function getDefaultWarlockScoring(): ArmorScoring {
  return new ArmorScoring({ Recovery: 3, Discipline: 3 });
}

export function getTheoreticalMin(armorScoring: ArmorScoring): number {
  // per subgroup: highest weighting * lowest stat + medium weighting * medium stat + smallest weighting * highest stat

  const sortedSubGroup1 = armorScoring.getSortedSubGroup1();
  const sortedSubGroup2 = armorScoring.getSortedSubGroup2();

  const plugs = [
    [2, 10, 10],
    [2, 2, 20],
    [2, 6, 16],
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

export function getTheoreticalMax(armorScoring: ArmorScoring): number {
  const maxStatPossible = 30;
  const minStatPossible = 2;

  const sortedSubGroup1 = armorScoring.getSortedSubGroup1();
  const sortedSubGroup2 = armorScoring.getSortedSubGroup2();

  return (
    maxStatPossible * (sortedSubGroup1[0] + sortedSubGroup2[0]) +
    minStatPossible * (sortedSubGroup1[1] + sortedSubGroup1[2] + sortedSubGroup2[1] + sortedSubGroup2[2])
  );
}
