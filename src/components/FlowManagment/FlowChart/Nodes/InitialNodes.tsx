import { Handle, Position } from 'reactflow';

import styles from './style.module.scss';

import { FlagTriangle } from '@components/shared/Icons';

export function StartNode() {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      <div className={styles['node-container']}>
        <p className={styles['node-label']}>
          <FlagTriangle />
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
          <FlagTriangle fill="#D32F2F" />
          Ending point
        </p>
      </div>
    </>
  );
}
