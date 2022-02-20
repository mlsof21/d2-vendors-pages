import { getNormalizedScore, getRawScore, getTheoreticalMax, getTheoreticalMin } from './scoring';

const testCases = [
  {
    armorScore: { 2996146975: 1, 392767087: 1, 1943323491: 1, 1735777505: 1, 144602215: 1, 4244567218: 1 },
    armorStats: { 2996146975: 6, 392767087: 6, 1943323491: 10, 1735777505: 11, 144602215: 6, 4244567218: 6 },
    expectedRawScore: 45,
    expectedNormalizedScore: 4,
    expectedMin: 44,
    expectedMax: 68,
  },
  {
    armorScore: { 2996146975: 3, 392767087: 2, 1943323491: 1, 1735777505: 3, 144602215: 2, 4244567218: 1 },
    armorStats: { 2996146975: 10, 392767087: 2, 1943323491: 20, 1735777505: 10, 144602215: 16, 4244567218: 7 },
    expectedRawScore: 123,
    expectedNormalizedScore: 48,
    expectedMin: 60,
    expectedMax: 192,
  },
  {
    armorScore: { 2996146975: 3, 392767087: 3, 1943323491: 3, 1735777505: 3, 144602215: 3, 4244567218: 3 },
    armorStats: { 2996146975: 2, 392767087: 27, 1943323491: 2, 1735777505: 24, 144602215: 2, 4244567218: 6 },
    expectedRawScore: 189,
    expectedNormalizedScore: 79,
    expectedMin: 132,
    expectedMax: 204,
  },
  {
    armorScore: { 2996146975: 1, 392767087: 1, 1943323491: 1, 1735777505: 1, 144602215: 1, 4244567218: 1 },
    armorStats: { 2996146975: 2, 392767087: 2, 1943323491: 23, 1735777505: 20, 144602215: 12, 4244567218: 2 },
    expectedRawScore: 61,
    expectedNormalizedScore: 71,
    expectedMin: 44,
    expectedMax: 68,
  },
  {
    armorScore: { 2996146975: 0, 392767087: 0, 1943323491: 4, 1735777505: 0, 144602215: 0, 4244567218: 0 },
    armorStats: { 2996146975: 2, 392767087: 2, 1943323491: 28, 1735777505: 2, 144602215: 22, 4244567218: 6 },
    expectedRawScore: 112,
    expectedNormalizedScore: 93,
    expectedMin: 8,
    expectedMax: 120,
  },
  {
    armorScore: { 2996146975: 0, 392767087: 2, 1943323491: 0, 1735777505: 0, 144602215: 0, 4244567218: 1 },
    armorStats: { 2996146975: 2, 392767087: 30, 1943323491: 2, 1735777505: 10, 144602215: 2, 4244567218: 21 },
    expectedRawScore: 81,
    expectedNormalizedScore: 89,
    expectedMin: 6,
    expectedMax: 90,
  },
];

const minTestCases = [
  {
    armorScore: { 2996146975: 0, 392767087: 4, 1943323491: 6, 1735777505: 0, 144602215: 0, 4244567218: 0 },
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
