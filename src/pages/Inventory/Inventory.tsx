import { useEffect } from 'react';
import { getInventoryForAllCharacters } from '../../bungie-api/destiny2-api';
import MembershipInfoStorage from '../../storage/Membership';
import './inventory.scss';

const Inventory = () => {
  const membershipInfo = MembershipInfoStorage.getInstance().getMembershipInfo();
  useEffect(() => {
    getAllData();
  });

  async function getAllData() {
    if (membershipInfo) {
      const inventories = await getInventoryForAllCharacters(membershipInfo);
    }
  }

  return <>This is the Inventory page</>;
};

export default Inventory;
