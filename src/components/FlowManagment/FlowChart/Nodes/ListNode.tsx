import { Handle, NodeProps, Position } from 'reactflow';

import styles from './style.module.scss';

import { HexagonOutlinedIconSvg } from '@components/shared/Icons';
import { NodeData } from '@domain/flow';

const ListNode: React.FC<NodeProps<NodeData>> = ({ data }) => (
  <div id={data.stepId} className={styles['node-list-container']}>
    <div className={styles['node-list-container__header']}>
      <Handle type="target" position={Position.Left} />
      <HexagonOutlinedIconSvg />
      <div>
        <p className={styles['node-tag']}>{data?.tag || 'No tag'}</p>
        <p className={styles['node-label']}>{data.name}</p>
      </div>
    </div>
    <ul className={styles['node-list-container__list']}>
      {data?.splits?.map((el, idx) => (
        <div key={idx}>
          <li>{el.percentage}%</li>
          <Handle
            type="source"
            position={Position.Right}
            id={el.edgeId}
            style={{ top: 70 + idx * 40 }}
          />
        </div>
      ))}
    </ul>
    {data.splits?.length === 0 && (
      <Handle type="source" position={Position.Right} />
    )}
  </div>
);

export default ListNode;
