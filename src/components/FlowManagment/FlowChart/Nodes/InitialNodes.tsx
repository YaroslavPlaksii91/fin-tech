import { Handle, NodeProps, Position } from 'reactflow';

import { StepType } from '../types';

import { STEP_ICONS } from '@constants/common';
import { useNodeConnection } from '@hooks/useNodeConnection';
import { NodeData } from '@domain/flow';

export const StartNode = ({ id }: NodeProps<NodeData>) => {
  const isConnectable = useNodeConnection('source', id);

  return (
    <>
      <Handle
        isConnectable={isConnectable}
        type="source"
        position={Position.Right}
      />
      <div className="node-container">
        <p className="node-label">
          {STEP_ICONS[StepType.START]}
          Starting point
        </p>
      </div>
    </>
  );
};

export const EndNode = () => (
  <>
    <Handle type="target" position={Position.Left} />
    <div className="node-container">
      <p className="node-label">
        {STEP_ICONS[StepType.END]}
        Ending point
      </p>
    </div>
  </>
);
