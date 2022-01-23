import classNames from 'classnames';
import { ArmorStats } from '../../scoring/items';
import ItemPopupStatBar from '../ItemPopupStatBar/ItemPopupStatBar';
import './itemPopupStats.scss';

type ItemPopupStatsProps = {
  armorStats?: ArmorStats;
  highlightedStats?: string[];
};

const ItemPopupStats = ({ armorStats, highlightedStats }: ItemPopupStatsProps) => {
  const mobilityClassName = highlightedStats?.includes('Mobility') ? 'highlightedStat' : '';
  const resilienceClassName = highlightedStats?.includes('Resilience') ? 'highlightedStat' : '';
  const recoveryClassName = highlightedStats?.includes('Recovery') ? 'highlightedStat' : '';
  const disciplineClassName = highlightedStats?.includes('Discipline') ? 'highlightedStat' : '';
  const intellectClassName = highlightedStats?.includes('Intellect') ? 'highlightedStat' : '';
  const strengthClassName = highlightedStats?.includes('Strength') ? 'highlightedStat' : '';
  return (
    <div className="statsContainer">
      <div className="stat">
        <div className="statLabel">
          <span className={mobilityClassName}>Mobility:</span>
        </div>
        <div className={classNames(mobilityClassName, 'statValue')}>{armorStats?.Mobility}</div>
        <ItemPopupStatBar stat={armorStats?.Mobility} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span className={resilienceClassName}>Resilience:</span>
        </div>
        <div className={classNames(resilienceClassName, 'statValue')}>{armorStats?.Resilience}</div>
        <ItemPopupStatBar stat={armorStats?.Resilience} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span className={recoveryClassName}>Recovery:</span>
        </div>
        <div className={classNames(recoveryClassName, 'statValue')}>{armorStats?.Recovery}</div>
        <ItemPopupStatBar stat={armorStats?.Recovery} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span className={disciplineClassName}>Discipline:</span>
        </div>
        <div className={classNames(disciplineClassName, 'statValue')}>{armorStats?.Discipline}</div>
        <ItemPopupStatBar stat={armorStats?.Discipline} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span className={intellectClassName}>Intellect:</span>
        </div>
        <div className={classNames(intellectClassName, 'statValue')}>{armorStats?.Intellect}</div>
        <ItemPopupStatBar stat={armorStats?.Intellect} />
      </div>
      <div className="stat">
        <div className="statLabel">
          <span className={strengthClassName}>Strength:</span>
        </div>
        <div className={classNames(strengthClassName, 'statValue')}>{armorStats?.Strength}</div>
        <ItemPopupStatBar stat={armorStats?.Strength} />
      </div>
    </div>
  );
};

export default ItemPopupStats;
