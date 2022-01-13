import {
  DestinyClass,
  DestinyComponentType,
  DestinyManifest,
  DestinyManifestSlice,
  DestinyProfileResponse,
  getDestinyManifest,
  getDestinyManifestSlice,
  getLinkedProfiles,
  getProfile,
} from 'bungie-api-ts/destiny2';
import { $http, $httpAuthenticated } from '../helpers';
import { MembershipInfo } from '../storage/Membership';

export async function getMembershipInfo(membershipId: string): Promise<MembershipInfo> {
  console.log('Fetching membership info', membershipId);
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
  DestinyManifestSlice<'DestinyInventoryItemDefinition'[]>
> {
  const manifest = await getManifest();
  const manifestSlice = await getDestinyManifestSlice($http, {
    destinyManifest: manifest,
    language: 'en',
    tableNames: ['DestinyInventoryItemDefinition'],
  });

  return manifestSlice;
}
