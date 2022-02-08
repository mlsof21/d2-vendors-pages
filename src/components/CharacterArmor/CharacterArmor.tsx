import { BUNGIE_ROOT } from '../../helpers';
import { CharacterItem } from '../../scoring/inventory';
import './characterArmor.scss';

export interface CharacterArmorProps {
  inventoryItems: CharacterItem[];
}

const CharacterArmor = ({ inventoryItems }: CharacterArmorProps) => {
  return (
    <div className="characterArmor">
      {inventoryItems.map((item) => (
        <div key={item.item.item.itemInstanceId} className="itemCell">
          <img
            key={item.item.item.itemInstanceId}
            className="item-img"
            src={`${BUNGIE_ROOT}${item.item.itemDef.displayProperties.icon}`}
          />
          <span className="scoreOverlay">{item.score}</span>
        </div>
      ))}
    </div>
  );
};

export default CharacterArmor;
