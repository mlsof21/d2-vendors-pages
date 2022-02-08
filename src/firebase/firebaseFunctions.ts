import { child, get, ref, set } from 'firebase/database';
import { db } from './firebase';

export async function readVendorData(refreshDate: string): Promise<string | null> {
  const dbRef = ref(db, 'vendor');

  const snapshot = await get(child(dbRef, `${refreshDate}/vendorResponses`));

  if (snapshot.exists()) {
    console.log('Reading data from firebase');
    return snapshot.val();
  }
  return null;
}

export function writeVendorData(vendorResponses: string, refreshDate: string) {
  set(ref(db, `vendor/${refreshDate}`), {
    vendorResponses,
  });
}
