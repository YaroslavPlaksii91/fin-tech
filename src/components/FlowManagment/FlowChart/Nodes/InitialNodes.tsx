import { Handle, Position } from 'reactflow';

import styles from './style.module.scss';

export function StartNode() {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      <div className={styles['node-start']} />
    </>
  );
}

export function EndNode() {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className={styles['node-end']} />
    </>
  );
}
