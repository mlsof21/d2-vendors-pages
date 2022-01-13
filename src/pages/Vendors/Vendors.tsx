import { HttpClientConfig } from 'bungie-api-ts/http';
import { ReactElement, useEffect, useState } from 'react';
import { $httpAuthenticated } from '../../helpers';

function Vendors(): ReactElement {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorInventory();
  }, []);

  async function fetchVendorInventory() {
    // const config: HttpClientConfig = { method: 'GET', url };
    // const vendorResponse = $httpAuthenticated();
    setLoading(false);
  }

  if (loading) {
    return <>Fetching Vendor Inventory</>;
  }

  return <>Fetched</>;
}

export default Vendors;
