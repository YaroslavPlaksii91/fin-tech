import { Handle, Position } from 'reactflow';

import { StepType } from '../types';

import { STEP_ICONS } from '@constants/common';

export function StartNode() {
  return (
    <>
      <Handle type="source" position={Position.Right} />
      <div className="node-container">
        <p className="node-label">
          {STEP_ICONS[StepType.START]}
          Starting point
        </p>
      </div>
    </>
  );
}

export function EndNode() {
  return (
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
}
