import { ReactElement, useEffect, useState } from 'react';
import { getVendorsForAllCharacters } from '../../bungie-api/destiny2-api';
import Spinner from '../../components/Spinner/Spinner';
import { armorTypes, classTypeMap, vendorHashes } from '../../hashes';
import { getArmorScores, getScorableItems as getScorableArmor, ScorableItems } from '../../scoring/items';
import MembershipInfoStorage from '../../storage/Membership';

function Vendors(): ReactElement {
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Fetching Vendor inventory');
  const [armorScores, setArmorScores] = useState<ScorableItems>();

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
      const scores = await getArmorScores(scorableArmor, allVendors);
      setArmorScores(scores);
    }
    setLoading(false);
  }

  return (
    <div>
      {loading && <Spinner text={currentStatus} noOverlay={true} />}
      {armorScores &&
        Object.keys(armorScores)
          .map((x) => parseInt(x))
          .map((classKey) => (
            <table key={classKey}>
              <tr>
                <th>{classTypeMap[classKey]}</th>
                {Object.keys(vendorHashes)
                  .map((x) => parseInt(x))
                  .map((vendorKey) => (
                    <th key={vendorKey}>{vendorHashes[vendorKey]}</th>
                  ))}
              </tr>

              {Object.keys(armorTypes)
                .map((x) => parseInt(x))
                .map((armorType) => (
                  <tr key={armorType}>
                    <th scope="row">{armorTypes[armorType]}</th>
                    {Object.keys(vendorHashes)
                      .map((x) => parseInt(x))
                      .map((vendorHash) => (
                        <td key={vendorHash}>{armorScores[classKey][vendorHash][armorType].normalizedScore}</td>
                      ))}
                  </tr>
                ))}
            </table>
          ))}
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
