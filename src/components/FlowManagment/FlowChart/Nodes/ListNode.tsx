import { Handle, Position } from 'reactflow';

import styles from './style.module.scss';

import { HexagonOutlinedIconSvg } from '@components/shared/Icons';

export default function ListNode() {
  return (
    <div className={styles['node-list-container']}>
      <div className={styles['node-list-container__header']}>
        <Handle type="target" position={Position.Left} />
        <HexagonOutlinedIconSvg />
        <div>
          <p className={styles['node-tag']}>No tag</p>
          <p className={styles['node-label']}>Champion Chalenger</p>
        </div>
      </div>
      <ul className={styles['node-list-container__list']}>
        <li>20%</li>
        <li>30%</li>
        <li>50%</li>
      </ul>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Right} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
    </div>
  );
}
