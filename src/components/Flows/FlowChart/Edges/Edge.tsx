import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath
} from 'reactflow';

import { EdgeObjectMenu } from '../AddButton/EdgeObjectMenu';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {
    color: 'red'
  },
  markerEnd,
  data
}: EdgeProps) {
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
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all'
          }}
          className="nodrag nopan"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
          <EdgeObjectMenu id={id} data={data} />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
