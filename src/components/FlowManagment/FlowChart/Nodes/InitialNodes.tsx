import { Handle, Position } from 'reactflow';

import { StepType } from '../types';

import styles from './style.module.scss';

import { STEP_ICONS } from '@constants/common';

export function StartNode() {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      <div className={styles['node-container']}>
        <p className={styles['node-label']}>
          {STEP_ICONS[StepType.START]}
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
          {STEP_ICONS[StepType.END]}
          Ending point
        </p>
      </div>
    </>
  );
}
