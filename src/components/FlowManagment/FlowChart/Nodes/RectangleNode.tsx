import { Handle, Position } from 'reactflow';

import styles from './style.module.scss';

import { HexagonOutlinedIconSvg } from '@components/shared/Icons';

export default function RectangleNode() {
  return (
    <div className={styles['node-rectangle']}>
      <Handle type="source" position={Position.Right} />
      <HexagonOutlinedIconSvg />
      <div>
        <p className={styles['node-tag']}>Tag</p>
        <p className={styles['node-label']}>Calculation</p>
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
