import { Handle, Position, NodeProps } from 'reactflow';

import styles from './style.module.scss';

import { Calculator } from '@components/shared/Icons';
import { NodeData, DecisionTableData } from '@domain/flow';
import { NO_TAG_LABEL } from '@constants/common';

const RectangleNode: React.FC<NodeProps<NodeData & DecisionTableData>> = ({
  data
}) => (
  <div id={data.stepId} className={styles['node-container']}>
    <Handle type="source" position={Position.Right} />
    <div className={styles['node-header']}>
      {/* TODO add condition for icons DECISION_TABLE and SUBFLOW */}
      <Calculator />
      <div>
        <p className={styles['node-tag']}>{data?.tag || NO_TAG_LABEL}</p>
        <p className={styles['node-label']}>{data.name}</p>
      </div>
    </div>
    <Handle type="target" position={Position.Left} />
  </div>
);

export default RectangleNode;
