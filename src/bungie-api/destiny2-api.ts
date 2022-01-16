import {
  BungieMembershipType,
  DestinyClass,
  DestinyComponentType,
  DestinyManifest,
  DestinyManifestSlice,
  DestinyProfileResponse,
  DestinyVendorsResponse,
  getDestinyManifest,
  getDestinyManifestSlice,
  getLinkedProfiles,
  getProfile,
  getVendors as getVendorsTs,
} from 'bungie-api-ts/destiny2';
import { $http, $httpAuthenticated } from '../helpers';
import { MembershipInfo } from '../storage/Membership';

export async function getMembershipInfo(membershipId: string): Promise<MembershipInfo> {
  const linkedProfiles = await getLinkedProfiles($httpAuthenticated, {
    membershipId,
    membershipType: 254,
    getAllMemberships: true,
  }).then((response) => response.Response);
  const destinyMembershipId = linkedProfiles.profiles[0].membershipId;
  const membershipType = linkedProfiles.profiles[0].membershipType;

  const profile = await getProfile($httpAuthenticated, {
    destinyMembershipId,
    components: [200],
    membershipType,
  }).then((response) => response.Response);

  const characters = getCharactersIds(profile);
  const membershipInfo: MembershipInfo = {
    bungieMembershipId: membershipId,
    destinyMembershipId,
    membershipType,
    hunterId: characters.hunter,
    titanId: characters.titan,
    warlockId: characters.warlock,
  };

  return membershipInfo;
}

export interface Characters {
  hunter: string | null;
  titan: string | null;
  warlock: string | null;
}

function getCharactersIds(profile: DestinyProfileResponse): Characters {
  let hunterId: string | null = null,
    titanId: string | null = null,
    warlockId: string | null = null;
  if (profile.characters.data) {
    const profileCharacters = profile.characters.data;
    Object.keys(profile.characters.data).forEach((id) => {
      switch (profileCharacters[id].classType) {
        case 0:
          titanId = id;
          break;
        case 1:
          hunterId = id;
          break;
        case 2:
          warlockId = id;
          break;
        default:
          throw new Error('Unknown class type');
      }
    });
  }

  return {
    hunter: hunterId,
    titan: titanId,
    warlock: warlockId,
  };
}

export async function getManifest(): Promise<DestinyManifest> {
  const response = await getDestinyManifest($http);
  return response.Response;
}

export async function getDestinyInventoryItemManifest(): Promise<
  DestinyManifestSlice<['DestinyInventoryItemDefinition', 'DestinyStatDefinition']>
> {
  const manifest = await getManifest();
  const manifestSlice = await getDestinyManifestSlice($http, {
    destinyManifest: manifest,
    language: 'en',
    tableNames: ['DestinyInventoryItemDefinition', 'DestinyStatDefinition'],
  });
  return manifestSlice;
}

export interface CharacterToId {
  id: string;
  classType: DestinyClass;
}

function mapCharacterIds(membershipInfo: MembershipInfo): CharacterToId[] {
  const hunterId = membershipInfo.hunterId;
  const titanId = membershipInfo.titanId;
  const warlockId = membershipInfo.warlockId;

  const value: CharacterToId[] = [];

  if (titanId) value.push({ id: titanId, classType: 0 });
  if (hunterId) value.push({ id: hunterId, classType: 1 });
  if (warlockId) value.push({ id: warlockId, classType: 2 });
  return value;
}

export async function getVendorsForAllCharacters(membershipInfo: MembershipInfo) {
  const characterIds = mapCharacterIds(membershipInfo);

  const fullResponse: { [key: number]: DestinyVendorsResponse } = {};
  await Promise.all(
    characterIds.map(async ({ id, classType }) => {
      const response = await getVendors(id, membershipInfo.destinyMembershipId, membershipInfo.membershipType);
      fullResponse[classType] = response;
    }),
  );

  return fullResponse;
}

export async function getVendors(
  characterId: string,
  destinyMembershipId: string,
  membershipType: BungieMembershipType,
): Promise<DestinyVendorsResponse> {
  const response = await getVendorsTs($httpAuthenticated, {
    characterId,
    components: [304, 402],
    destinyMembershipId,
    membershipType,
  });

  return response.Response;
}
