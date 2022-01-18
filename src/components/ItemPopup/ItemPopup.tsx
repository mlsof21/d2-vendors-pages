import React, { ReactElement, useEffect, useRef } from 'react';
import { Armor } from '../../scoring/items';
import './itemPopup.scss';
import ItemPopupStats from './ItemPopupStats';

export interface ItemPopupProps {
  armorInfo?: Armor;
  show: boolean;
  onClickOutside: () => void;
  top: number;
  left: number;
}

function ItemPopup({ armorInfo, show, onClickOutside, top, left }: ItemPopupProps): ReactElement {
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

  if (show) {
    return (
      <div ref={ref} className="modal" style={parentDivStyle}>
        <h3>{armorInfo?.name}</h3>
        <div className="imgAndFlavor">
          <img src={armorInfo?.iconPath} />
          <span>{armorInfo?.flavorText}</span>
        </div>
        <ItemPopupStats armorStats={armorInfo?.stats} />
      </div>
    );
  }
  return <></>;
}

export default ItemPopup;
