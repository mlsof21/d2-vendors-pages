import { ArmorScoring, ArmorStats, getNormalizedScore, getRawScore, getTheoreticalMax } from './items';
import { getDestinyInventoryItemDefinitionFromStore, getDestinyStatDefinitionFromStore } from '../storage/IndexedDB';

jest.mock('../storage/IndexedDB');

const testCases = [
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
    expectedNormalizedScore: 64,
    expectedMax: 192,
  },
  {
    armorScore: new ArmorScoring({ Mobility: 3, Resilience: 3, Recovery: 3, Discipline: 3, Intellect: 3, Strength: 3 }),
    armorStats: new ArmorStats({ Mobility: 3, Resilience: 2, Recovery: 1, Discipline: 3, Intellect: 2, Strength: 1 }),
    expectedRawScore: 36,
    expectedNormalizedScore: 18,
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
    expectedNormalizedScore: 90,
    expectedMax: 68,
  },
  {
    armorScore: new ArmorScoring({ Recovery: 4 }),
    armorStats: new ArmorStats({ Mobility: 3, Resilience: 2, Recovery: 1, Discipline: 3, Intellect: 2, Strength: 1 }),
    expectedRawScore: 4,
    expectedNormalizedScore: 3,
    expectedMax: 120,
  },
  {
    armorScore: new ArmorScoring({ Intellect: 10 }),
    armorStats: new ArmorStats({ Mobility: 3, Resilience: 2, Recovery: 1, Discipline: 3, Intellect: 16, Strength: 1 }),
    expectedRawScore: 160,
    expectedNormalizedScore: 53,
    expectedMax: 300,
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
      const normalizedScore = getNormalizedScore(test.expectedRawScore, test.expectedMax);
      expect(normalizedScore).toBe(test.expectedNormalizedScore);
    });
  });
});
