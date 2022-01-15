import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { getVendorsForAllCharacters } from '../../bungie-api/destiny2-api';
import Spinner from '../../components/Spinner/Spinner';
import { armorTypes, classTypeMap, vendorHashes } from '../../hashes';
import { getArmorScores, getScorableItems as getScorableArmor, ScorableItems } from '../../scoring/items';
import MembershipInfoStorage from '../../storage/Membership';
import './vendors.scss';

function Vendors(): ReactElement {
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('Fetching Vendor inventory');
  const [armorScores, setArmorScores] = useState<ScorableItems>();
  const [showNormalized, setShowNormalized] = useState(true);

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

  const handleCheckedChange = () => setShowNormalized(!showNormalized);

  return (
    <div>
      {!loading && (
        <label>
          Show Normalized Scores
          <input type="checkbox" checked={showNormalized} onChange={handleCheckedChange} />
        </label>
      )}
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
                        <td
                          key={vendorHash}
                          style={{
                            backgroundColor: showNormalized
                              ? armorScores[classKey][vendorHash][armorType].colors?.normalizedColorHex
                              : armorScores[classKey][vendorHash][armorType].colors?.colorHex,
                          }}
                        >
                          {showNormalized
                            ? armorScores[classKey][vendorHash][armorType].normalizedScore
                            : armorScores[classKey][vendorHash][armorType].rawScore}
                        </td>
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
