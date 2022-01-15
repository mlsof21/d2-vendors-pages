import { DestinyInventoryItemDefinition, DestinyManifestSlice, DestinyStatDefinition } from 'bungie-api-ts/destiny2';
import { openDB } from 'idb';

// TODO: make this a class
async function get<Type>(key: string): Promise<Type> {
  const dbp = await openDB('destiny2-store', 1, {
    upgrade(db) {
      db.createObjectStore('d2');
    },
  });
  return dbp.get('d2', key);
}

async function set(key: string, val: any) {
  const dbp = await openDB('destiny2-store', 1, {
    upgrade(db) {
      db.createObjectStore('d2');
    },
  });
  return dbp.put('d2', val, key);
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
  // await set('DestinyStatDefinition', manifest.DestinyStatDefinition);
}

export async function getDestinyStatDefinitionFromStore(): Promise<{ [key: number]: DestinyStatDefinition }> {
  return await get('DestinyStatDefinition');
}

export async function getDestinyInventoryItemDefinitionFromStore(): Promise<{
  [key: number]: DestinyInventoryItemDefinition;
}> {
  return await get('DestinyInventoryItemDefinition');
}
