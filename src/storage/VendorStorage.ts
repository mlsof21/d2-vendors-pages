import Storage from './Storage';

enum Locals {
  REFRESH_DATE = 'refresh_date',
}

export default class VendorStorage extends Storage<Locals> {
  private static instance?: VendorStorage;

  private constructor() {
    super();
  }

  public static getInstance(): VendorStorage {
    if (!this.instance) {
      this.instance = new VendorStorage();
    }

    return this.instance;
  }
  public setRefreshDate(refreshDate: string): void {
    this.set(Locals.REFRESH_DATE, JSON.stringify(refreshDate));
  }

  public getRefreshDate(): string | null {
    const refreshDate = this.get(Locals.REFRESH_DATE);

    return refreshDate ? JSON.parse(refreshDate) : null;
  }

  public clear(): void {
    this.clearItems([Locals.REFRESH_DATE]);
  }
}
