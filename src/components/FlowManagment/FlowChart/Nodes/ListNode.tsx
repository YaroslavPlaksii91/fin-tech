import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';

import CustomHandler from '../CustomHandler/CustomHandler';
import { StepListData } from '../types';
import { getListNodesData } from '../utils/nodesUtils';

import styles from './style.module.scss';

import { NO_TAG_LABEL, STEP_ICONS } from '@constants/common';

const ListNode: React.FC<NodeProps<StepListData>> = ({ data }) => {
  const rfInstance = useReactFlow();

  const dataToShow = getListNodesData(data, rfInstance);

  return (
    <div id={data.stepId} className={styles['node-list-container']}>
      <Handle style={{ top: '25px' }} type="target" position={Position.Left} />
      <div className={styles['node-list-container__header']}>
        {STEP_ICONS[data.stepType]}
        <div className={styles['node-list-container__header__text']}>
          <p className={styles['node-tag']}>{data?.tag || NO_TAG_LABEL}</p>
          <p className={styles['node-label']}>{data.name}</p>
        </div>
      </div>
      <ul className={styles['node-list-container__list']}>
        {dataToShow.map((el, idx) => (
          <div
            className={`${styles['node-list-container__row']} ${styles['tooltip']}`}
            key={`${el.id}+${idx}`}
          >
            {el.tooltipText ? (
              <div className={styles['tooltip__content']}>{el.tooltipText}</div>
            ) : null}
            <li>{el.value}</li>
            <CustomHandler
              type="source"
              position={Position.Right}
              id={idx.toString()}
              style={{ top: '50%' }}
            />
          </div>
        ))}
      </ul>
      {dataToShow.length === 0 ? (
        <Handle type="source" position={Position.Right} />
      ) : null}
    </div>
  );
};

export default ListNode;
