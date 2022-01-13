import { DestinyInventoryItemDefinition, DestinyManifestSlice, DestinyStatDefinition } from 'bungie-api-ts/destiny2';
import { openDB } from 'idb';

const dbp = openDB('destiny2-store', 1, {
  upgrade(db) {
    db.createObjectStore('d2');
  },
});

async function get<Type>(key: string): Promise<Type> {
  return (await dbp).get('d2', key);
}

async function set(key: string, val: any) {
  return (await dbp).put('d2', val, key);
}

// async function del(key: string) {
//   return (await dbp).delete('d2', key);
// }
// async function clear() {
//   return (await dbp).clear('d2');
// }
// async function keys() {
//   return (await dbp).getAllKeys('d2');
// }

export async function storeManifest(
  manifest: DestinyManifestSlice<['DestinyInventoryItemDefinition', 'DestinyStatDefinition']>,
): Promise<void> {
  await set('DestinyInventoryItemDefinition', manifest.DestinyInventoryItemDefinition);
  await set('DestinyStatDefinition', manifest.DestinyStatDefinition);
}

export async function getDestinyStatDefinitionFromStore(): Promise<DestinyStatDefinition> {
  return await get('DestinyStatDefinition');
}

export async function getDestinyInventoryItemDefinitionFromStore(): Promise<DestinyInventoryItemDefinition> {
  return await get('DestinyInventoryItemDefinition');
}
