import { ArmorStats } from './items';
import { ArmorScoring, getNormalizedScore, getRawScore, getTheoreticalMax, getTheoreticalMin } from './scoring';

const testCases = [
  {
    armorScore: new ArmorScoring({ Mobility: 1, Resilience: 1, Recovery: 1, Discipline: 1, Intellect: 1, Strength: 1 }),
    armorStats: new ArmorStats({ Mobility: 6, Resilience: 6, Recovery: 10, Discipline: 11, Intellect: 6, Strength: 6 }),
    expectedRawScore: 45,
    expectedNormalizedScore: 4,
    expectedMin: 44,
    expectedMax: 68,
  },
  {
    armorScore: new ArmorScoring({ Mobility: 3, Resilience: 2, Recovery: 1, Discipline: 3, Intellect: 2, Strength: 1 }),
    armorStats: new ArmorStats({
      Mobility: 10,
      Resilience: 2,
      Recovery: 20,
      Discipline: 10,
      Intellect: 16,
      Strength: 7,
    }),
    expectedRawScore: 123,
    expectedNormalizedScore: 48,
    expectedMin: 60,
    expectedMax: 192,
  },
  {
    armorScore: new ArmorScoring({ Mobility: 3, Resilience: 3, Recovery: 3, Discipline: 3, Intellect: 3, Strength: 3 }),
    armorStats: new ArmorStats({ Mobility: 2, Resilience: 27, Recovery: 2, Discipline: 24, Intellect: 2, Strength: 6 }),
    expectedRawScore: 189,
    expectedNormalizedScore: 79,
    expectedMin: 132,
    expectedMax: 204,
  },
  {
    armorScore: new ArmorScoring({ Mobility: 1, Resilience: 1, Recovery: 1, Discipline: 1, Intellect: 1, Strength: 1 }),
    armorStats: new ArmorStats({
      Mobility: 2,
      Resilience: 2,
      Recovery: 23,
      Discipline: 20,
      Intellect: 12,
      Strength: 2,
    }),
    expectedRawScore: 61,
    expectedNormalizedScore: 71,
    expectedMin: 44,
    expectedMax: 68,
  },
  {
    armorScore: new ArmorScoring({ Recovery: 4 }),
    armorStats: new ArmorStats({ Mobility: 2, Resilience: 2, Recovery: 28, Discipline: 2, Intellect: 22, Strength: 6 }),
    expectedRawScore: 112,
    expectedNormalizedScore: 93,
    expectedMin: 8,
    expectedMax: 120,
  },
  {
    armorScore: new ArmorScoring({ Resilience: 2, Strength: 1 }),
    armorStats: new ArmorStats({
      Mobility: 2,
      Resilience: 30,
      Recovery: 2,
      Discipline: 10,
      Intellect: 2,
      Strength: 21,
    }),
    expectedRawScore: 81,
    expectedNormalizedScore: 89,
    expectedMin: 6,
    expectedMax: 90,
  },
];

const minTestCases = [
  {
    armorScore: new ArmorScoring({ Mobility: 0, Resilience: 4, Recovery: 6, Discipline: 0, Intellect: 0, Strength: 0 }),
    expectedMin: 20,
  },
];

describe('test scoring', () => {
  testCases.forEach((test) => {
    it(`getRawScore returns ${test.expectedRawScore}`, () => {
      const rawScore = getRawScore(test.armorStats, test.armorScore);
      expect(rawScore).toBe(test.expectedRawScore);
    });
  });
  testCases.forEach((test) => {
    it(`getTheoreticalMax returns ${test.expectedMax}`, () => {
      const score = getTheoreticalMax(test.armorScore);
      expect(score).toBe(test.expectedMax);
    });
  });
  testCases.forEach((test) => {
    it(`getNormalizedScore returns ${test.expectedNormalizedScore}`, () => {
      const normalizedScore = getNormalizedScore(test.expectedRawScore, test.expectedMin, test.expectedMax);
      expect(normalizedScore).toBe(test.expectedNormalizedScore);
    });
  });

  testCases.forEach((test) => {
    it(`getTheoreticalMin returns ${test.expectedMin}`, () => {
      const score = getTheoreticalMin(test.armorScore);
      expect(score).toBe(test.expectedMin);
    });
  });

  minTestCases.forEach((test) => {
    it(`getTheoreticalMin returns ${test.expectedMin}`, () => {
      const score = getTheoreticalMin(test.armorScore);
      expect(score).toBe(test.expectedMin);
    });
  });
});
