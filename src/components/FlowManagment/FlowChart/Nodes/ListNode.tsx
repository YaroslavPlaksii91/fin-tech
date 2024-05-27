import { Handle, NodeProps, Position, useUpdateNodeInternals } from 'reactflow';
import { useEffect, useMemo } from 'react';

import CustomHandler from '../CustomHandler/CustomHandler';
import { StepListData } from '../types';
import { getListNodesData } from '../utils/nodesUtils';

import styles from './style.module.scss';

import ArrowLeftAndRightSquareIcon from '@icons/arrowLeftAndRightSquare.svg';
import { NO_TAG_LABEL } from '@constants/common';

const ListNode: React.FC<NodeProps<StepListData>> = ({ data }) => {
  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    updateNodeInternals(data.stepId);
  });

  const dataToShow = useMemo(() => getListNodesData(data), [data]);

  return (
    <div id={data.stepId} className={styles['node-list-container']}>
      <div className={styles['node-list-container__header']}>
        <Handle type="target" position={Position.Top} />
        <ArrowLeftAndRightSquareIcon />
        <div className={styles['node-list-container__header__text']}>
          <p className={styles['node-tag']}>{data?.tag || NO_TAG_LABEL}</p>
          <p className={styles['node-label']}>{data.name}</p>
        </div>
      </div>
      <ul className={styles['node-list-container__list']}>
        {dataToShow.map((el, idx) => (
          <div
            className={styles['node-list-container__row']}
            key={`${el.id}+${idx}`}
          >
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
