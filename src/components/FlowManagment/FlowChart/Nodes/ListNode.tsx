import { Handle, NodeProps, Position } from 'reactflow';

import styles from './style.module.scss';

import { HexagonOutlinedIconSvg } from '@components/shared/Icons';
import { NodeData } from '@domain/flow';
import Logger from '@utils/logger';

const ListNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  Logger.info('DATA:', data);
  return (
    <div className={styles['node-list-container']}>
      <div className={styles['node-list-container__header']}>
        <Handle type="target" position={Position.Left} />
        <HexagonOutlinedIconSvg />
        <div>
          <p className={styles['node-tag']}>{data?.tag || 'No tag'}</p>
          <p className={styles['node-label']}>{data.name}</p>
        </div>
      </div>
      <ul className={styles['node-list-container__list']}>
        {data?.splits?.map((el, idx) => <li key={idx}>{el.percentage}%</li>)}
      </ul>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Right} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
    </div>
  );
};

export default ListNode;
