import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath
} from 'reactflow';

import { StepSelectionMenu } from '../../../StepManagment/StepSelectionMenu/StepSelectionMenu';
import { EdgeData } from '../types';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data
}: EdgeProps<EdgeData>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <>
      <BaseEdge id={id} style={style} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all'
          }}
          className="nodrag nopan"
        >
          <StepSelectionMenu id={id} data={data} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
