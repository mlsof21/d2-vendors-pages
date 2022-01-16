import { ReactElement } from 'react';
import { Armor } from '../../scoring/items';
import './scoreCell.scss';

export interface ScoreCellProps {
  color?: string;
  score?: number;
  armorInfo?: Armor;
}

function ScoreCell({ color, score, armorInfo }: ScoreCellProps): ReactElement {
  return (
    <td
      className="scoreCell"
      style={{
        backgroundColor: color,
      }}
      onClick={() => console.log(armorInfo?.itemHash)}
    >
      {score}
    </td>
  );
}

export default ScoreCell;
