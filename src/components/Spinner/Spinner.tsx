import classNames from 'classnames';
import { FC } from 'react';
import './spinner.scss';

type SpinnerProps = {
  text?: string;
  noOverlay?: boolean;
  className?: string | string[];
};

const Spinner = ({ text, noOverlay, className, ...rest }: SpinnerProps) => {
  const classes = classNames('Spinner', noOverlay && 'Spinner--noOverlay', className);

  return (
    <div {...rest} className={classes}>
      <div className="Spinner-spinner">
        <svg viewBox="0 0 64 64">
          <circle transform="translate(32,32)" r="26" />
        </svg>
      </div>
      {text ? <div className="Spinner-content">{text}</div> : null}
    </div>
  );
};

export default Spinner;
