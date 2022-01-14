import { ReactElement, useEffect, useState } from 'react';
import { getVendorsForAllCharacters } from '../../bungie-api/destiny2-api';
import Spinner from '../../components/Spinner/Spinner';
import { getArmorScores, getScorableItems as getScorableArmor } from '../../scoring/items';
import MembershipInfoStorage from '../../storage/Membership';

function Vendors(): ReactElement {
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Fetching Vendor inventory');

  const membershipInfo = MembershipInfoStorage.getInstance().getMembershipInfo();

  useEffect(() => {
    fetchVendorInventory();
  }, []);

  async function fetchVendorInventory() {
    if (membershipInfo) {
      const allVendors = await getVendorsForAllCharacters(membershipInfo);
      setCurrentStatus('Getting scorable armor');
      const scorableArmor = await getScorableArmor(allVendors);
      setCurrentStatus('Scoring armor');
      const armorScores = await getArmorScores(scorableArmor, allVendors);
      console.log({ armorScores });
    }
    setLoading(false);
  }

  return (
    <div>
      {loading && <Spinner text={currentStatus} />}
      {/* {% for character_key in characters %}        
        <table>
          <tr>
            <th>{{character_key.title()}}</th>
            {% for vendor_key in vendors %}            
                <th>{{vendor_key}}</th>            
            {% endfor %}
          </tr>

          {% for armor_key in armor %}
          <tr>
            <th scope="row">{{armor_key}}</th>
            {% for vendor_key in vendors %} 
            <td style="background-color: {{all_stats[character_key][vendor_key][armor_key]["color"] }}">{{ all_stats[character_key][vendor_key][armor_key]["score"] }}</td>
            {% endfor %}
          </tr>
          {% endfor %}
        </table>
      {% endfor %} */}
    </div>
  );
}

export default Vendors;
