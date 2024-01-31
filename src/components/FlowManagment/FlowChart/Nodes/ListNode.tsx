import { Handle, NodeProps, Position, useUpdateNodeInternals } from 'reactflow';
import { useEffect } from 'react';

import CustomHandle from '../CustomeHandler/CustomeHandler';

import styles from './style.module.scss';

import { HexagonOutlinedIconSvg } from '@components/shared/Icons';
import { NodeData, ChampionChallengerData } from '@domain/flow';

const ListNode: React.FC<NodeProps<NodeData & ChampionChallengerData>> = ({
  data
}) => {
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(data.stepId);
  });

  return (
    <div id={data.stepId} className={styles['node-list-container']}>
      <div className={styles['node-list-container__header']}>
        <Handle type="target" position={Position.Left} />
        <HexagonOutlinedIconSvg />
        <div className={styles['node-list-container__header__text']}>
          <p className={styles['node-tag']}>{data?.tag || 'No tag'}</p>
          <p className={styles['node-label']}>{data.name}</p>
        </div>
      </div>
      <ul className={styles['node-list-container__list']}>
        {data?.splits?.map((el, idx) => (
          <div key={el.edgeId}>
            <li>{el.percentage}%</li>
            <CustomHandle
              connectionLimit={1}
              type="source"
              position={Position.Right}
              id={idx.toString()}
              style={{ top: 75 + idx * 45 }}
            />
          </div>
        ))}
      </ul>
      {data.splits?.length === 0 && (
        <Handle type="source" position={Position.Right} />
      )}
    </div>
  );
};

export default ListNode;
