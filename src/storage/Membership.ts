import Storage from './Storage';

enum Locals {
  MEMBERSHIP_INFO = 'membership_info',
}

export interface MembershipInfo {
  bungieMembershipId: string;
  hunterId: string | null;
  titanId: string | null;
  warlockId: string | null;
  destinyMembershipId: string;
  membershipType: number;
}

export default class MembershipInfoStorage extends Storage<Locals> {
  private static instance?: MembershipInfoStorage;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MembershipInfoStorage();
    }
    return this.instance;
  }

  public getMembershipInfo(): MembershipInfo | undefined {
    const membershipInfo = this.get(Locals.MEMBERSHIP_INFO);
    if (membershipInfo) return JSON.parse(membershipInfo);

    return undefined;
  }

  public setMembershipInfo(membershipInfo: string) {
    this.set(Locals.MEMBERSHIP_INFO, membershipInfo);
  }
}
