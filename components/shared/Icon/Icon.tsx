import React, { CSSProperties } from 'react';
import classnames from 'classnames';

import styles from './Icon.module.scss';

interface IconProps {
  symbol: {
    id: string;
    viewBox: string;
  };
  className?: string;
  size?: number;
  style?: CSSProperties;
  withTransition?: boolean;
}

const Icon: React.FC<IconProps> = ({
  symbol,
  className,
  size,
  style,
  withTransition,
  ...props
}) => {
  const componentInlineStyles = style ? Object.assign({}, style) : {};

  if (size) {
    componentInlineStyles.width = componentInlineStyles.height = size;
  }

  const xlinkHref = '#' + symbol?.id;

  return (
    <svg
      viewBox={symbol?.viewBox}
      className={classnames(styles.icon, className, {
        [styles.transition]: withTransition
      })}
      style={componentInlineStyles}
      aria-hidden="true"
      {...props}
    >
      <use xlinkHref={xlinkHref} />
    </svg>
  );
};

export default Icon;
