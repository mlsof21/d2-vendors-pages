import { useEffect, useRef } from 'react';
import { ScoredArmor } from '../../scoring/items';
import './itemPopup.scss';
import ItemPopupStats from './ItemPopupStats';

type ItemPopupProps = {
  armorInfo: ScoredArmor;
  show: boolean;
  onClickOutside: () => void;
  top: number;
  left: number;
};

const ItemPopup = ({ armorInfo, show, onClickOutside, top, left }: ItemPopupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (event.target) {
      if (ref.current && !ref.current?.contains(event.target)) {
        onClickOutside && onClickOutside();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  const parentDivStyle = {
    top,
    left,
  };

  if (ref.current && ref.current.clientWidth + top > window.innerWidth) {
    console.log('Popup is showing off screen');
  }

  if (show) {
    return (
      <div ref={ref} className="modal" style={parentDivStyle}>
        <h3>{armorInfo?.name}</h3>
        <div className="imgAndFlavor">
          <img src={armorInfo?.iconPath} />
        </div>
        <ItemPopupStats armorStats={armorInfo.stats} highlightedStats={armorInfo.scoredStats} />
      </div>
    );
  }
  return <></>;
};

export default ItemPopup;
