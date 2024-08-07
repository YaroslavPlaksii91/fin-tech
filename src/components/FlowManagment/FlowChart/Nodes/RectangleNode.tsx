import { Handle, Position, NodeProps } from 'reactflow';

import { NodeData, DecisionTableData } from '@domain/flow';
import { NO_TAG_LABEL, STEP_ICONS } from '@constants/common';

// const RectangleNode: React.FC<NodeProps<NodeData & DecisionTableData>> = ({
//   data
// }) => (
//   <div id={data.stepId} className={styles['node-container']}>
//     <Handle type="source" position={Position.Right} />
//     <div className={styles['node-header']}>
//       {STEP_ICONS[data.stepType]}
//       <div>
//         <p className={styles['node-tag']}>{data?.tag || NO_TAG_LABEL}</p>
//         <p className={styles['node-label']}>{data.name}</p>
//       </div>
//     </div>
//     <Handle type="target" position={Position.Left} />
//   </div>
// );
const RectangleNode: React.FC<NodeProps<NodeData & DecisionTableData>> = ({
  data
}) => (
  <div id={data.stepId} className="node-container">
    <Handle type="source" position={Position.Right} />
    <div className="node-header">
      {STEP_ICONS[data.stepType]}
      <div>
        <p className="node-tag">{data?.tag || NO_TAG_LABEL}</p>
        <p className="node-label">{data.name}</p>
      </div>
    </div>
    <Handle type="target" position={Position.Left} />
  </div>
);

export default RectangleNode;
