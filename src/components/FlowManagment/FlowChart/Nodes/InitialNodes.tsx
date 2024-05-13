import { Handle, Position } from 'reactflow';

import styles from './style.module.scss';

import FlagTriangleIcon from '@icons/flagTriangle.svg';
import { theme } from '@theme';

export function StartNode() {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      <div className={styles['node-container']}>
        <p className={styles['node-label']}>
          <FlagTriangleIcon color={theme.palette.primary.main} />
          Starting point
        </p>
      </div>
    </>
  );
}

export function EndNode() {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={styles['node-container']}>
        <p className={styles['node-label']}>
          <FlagTriangleIcon color={theme.palette.error.main} />
          Ending point
        </p>
      </div>
    </>
  );
}
