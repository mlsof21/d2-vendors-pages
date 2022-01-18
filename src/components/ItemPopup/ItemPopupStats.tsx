import { ReactElement } from 'react';
import { ArmorStats } from '../../scoring/items';
import ItemPopupStatBar from '../ItemPopupStatBar/ItemPopupStatBar';
import './itemPopupStats.scss';

export interface ItemPopupStatsProps {
  armorStats?: ArmorStats;
}

function ItemPopupStats({ armorStats }: ItemPopupStatsProps): ReactElement {
  return (
    <div className="statsContainer">
      <div className="stat">
        <div className="statLabel">
          <span>Mobility:</span>
        </div>
        <div className="statValue">{armorStats?.Mobility}</div>
        <ItemPopupStatBar stat={armorStats?.Mobility} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span>Resilience:</span>
        </div>
        <div className="statValue">{armorStats?.Resilience}</div>
        <ItemPopupStatBar stat={armorStats?.Resilience} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span>Recovery:</span>
        </div>
        <div className="statValue">{armorStats?.Recovery}</div>
        <ItemPopupStatBar stat={armorStats?.Recovery} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span>Discipline:</span>
        </div>
        <div className="statValue">{armorStats?.Discipline}</div>
        <ItemPopupStatBar stat={armorStats?.Discipline} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span>Intellect:</span>
        </div>
        <div className="statValue">{armorStats?.Intellect}</div>
        <ItemPopupStatBar stat={armorStats?.Intellect} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span>Strength:</span>
        </div>
        <div className="statValue">{armorStats?.Strength}</div>
        <ItemPopupStatBar stat={armorStats?.Strength} />
      </div>
    </div>
  );
}

export default ItemPopupStats;
