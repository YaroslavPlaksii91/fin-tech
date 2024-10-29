import { Handle, Position, NodeProps } from 'reactflow';

import { NodeData, DecisionTableData } from '@domain/flow';
import { NO_TAG_LABEL, STEP_ICONS } from '@constants/common';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';

const RectangleNode: React.FC<NodeProps<NodeData & DecisionTableData>> = ({
  data,
  isConnectable
}) => {
  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isPreview = !isConnectable || !canUpdateFlow;
  const isNoteVisible = data.note && isPreview;

  return (
    <>
      <div id={data.stepId} className="node-container">
        <Handle type="source" position={Position.Right} />
        <div className="node-header">
          {STEP_ICONS[data.stepType]}
          <div>
            <p className="node-tag">{data?.tag || NO_TAG_LABEL}</p>
            <p className="node-label">{data.name}</p>
          </div>
          {isNoteVisible && <div className="node-note__icon" />}
        </div>
        <Handle type="target" position={Position.Left} />
      </div>
      {isNoteVisible && <div className="node-note">{data.note}</div>}
    </>
  );
};

export default RectangleNode;
