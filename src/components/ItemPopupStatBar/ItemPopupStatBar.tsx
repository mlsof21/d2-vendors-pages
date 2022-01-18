import { ReactElement } from 'react';
import './itemPopupStatBar.scss';

export interface ItemPopupStatBarProps {
  stat?: number;
}

function ItemPopupStatBar({ stat }: ItemPopupStatBarProps): ReactElement {
  const parentDiv = {
    height: '100%',
    width: '100%',
    backgroundColor: 'grey',
  };

  const value = stat ? (stat / 30) * 100 : 0;

  const childDiv = {
    height: '100%',
    width: `${value}%`,
    backgroundColor: 'white',
  };

  const progressText = {
    padding: 10,
    color: 'black',
    fontWeight: 900,
  };

  return (
    <div className="barContainer" style={parentDiv}>
      <div style={childDiv}>
        <span style={progressText}></span>
      </div>
    </div>
  );
}

export default ItemPopupStatBar;
