import { Handle, Position, NodeProps } from 'reactflow';

import { NodeData, DecisionTableData } from '@domain/flow';
import { NO_TAG_LABEL, STEP_ICONS } from '@constants/common';
import { useNodeConnection } from '@hooks/useNodeConnection';

const RectangleNode = ({
  data,
  id
}: NodeProps<NodeData & DecisionTableData>) => {
  const isConnectable = useNodeConnection('source', id);

  return (
    <>
      <div id={data.stepId} className="node-container">
        <Handle
          isConnectable={isConnectable}
          type="source"
          position={Position.Right}
        />
        <div className="node-header">
          {STEP_ICONS[data.stepType]}
          <div>
            <p className="node-tag">{data?.tag || NO_TAG_LABEL}</p>
            <p className="node-label">{data.name}</p>
          </div>
          {data.note && <div className="node-note__icon" />}
        </div>
        <Handle type="target" position={Position.Left} />
      </div>
      {data.note && <div className="node-note">{data.note}</div>}
    </>
  );
};

export default RectangleNode;
