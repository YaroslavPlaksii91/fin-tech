import { Handle, NodeProps, Position, useUpdateNodeInternals } from 'reactflow';

import styles from './style.module.scss';

import { HexagonOutlinedIconSvg } from '@components/shared/Icons';
import { NodeData, ChampionChallengerData } from '@domain/flow';

const ListNode: React.FC<NodeProps<NodeData & ChampionChallengerData>> = ({
  data
}) => {
  useUpdateNodeInternals();

  // useEffect(() => {
  //   console.log('update');
  //   updateNodeInternals(data.stepId);
  // }, [data.splits]);

  return (
    <div id={data.stepId} className={styles['node-list-container']}>
      <div className={styles['node-list-container__header']}>
        <Handle
          type="target"
          position={Position.Left}
          // style={{ top: data.splits?.length !== 0 && 70 }}
        />
        <HexagonOutlinedIconSvg />
        <div>
          <p className={styles['node-tag']}>{data?.tag || 'No tag'}</p>
          <p className={styles['node-label']}>{data.name}</p>
        </div>
      </div>
      <ul className={styles['node-list-container__list']}>
        {data?.splits?.map((el, idx) => (
          <div key={el.edgeId}>
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
};

export default ListNode;
