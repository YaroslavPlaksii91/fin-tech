import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath
} from 'reactflow';

import { StepSelectionMenu } from '../../../StepManagment/StepSelectionMenu/StepSelectionMenu';
import { ADD_BUTTON_ON_EDGE, EdgeData } from '../types';

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
      <BaseEdge
        id={id}
        style={{ ...style, color: 'red' }}
        path={edgePath}
        markerEnd={markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          id={id}
          data-edge-type={ADD_BUTTON_ON_EDGE}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 1
          }}
          className={data?.animated ? 'edge-animation' : ''}
        >
          {data && <StepSelectionMenu id={id} data={data} />}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
