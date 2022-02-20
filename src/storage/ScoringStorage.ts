import Storage from './Storage';

enum Locals {
  SCORING = 'scoring',
}

export interface Scoring {
  [classKey: number]: Record<number, number>;
}

export default class ScoringStorage extends Storage<Locals> {
  private static instance?: ScoringStorage;

  private constructor() {
    super();
  }

  public static getInstance(): ScoringStorage {
    if (!this.instance) {
      this.instance = new ScoringStorage();
    }
    return this.instance;
  }

  public getScoring(): Scoring | undefined {
    const scoring = this.get(Locals.SCORING);
    if (scoring) return JSON.parse(scoring);

    return undefined;
  }

  public setScoring(scoring: Scoring): void {
    this.set(Locals.SCORING, JSON.stringify(scoring));
  }
}
