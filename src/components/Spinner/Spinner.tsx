import classNames from 'classnames';
import { ReactElement } from 'react';
import './spinner.scss';

export interface SpinnerDisplayProps {
  text?: string;
  noOverlay?: boolean;
  className?: string | string[];
}

function Spinner(props: SpinnerDisplayProps): ReactElement {
  const { text, noOverlay, className, ...rest } = props;

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
}

export default Spinner;
