import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';

import CustomHandler from '../CustomHandler/CustomHandler';
import { StepListData } from '../types';
import { getListNodesData } from '../utils/nodesUtils';

import { NO_TAG_LABEL, STEP_ICONS } from '@constants/common';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';

const ListNode: React.FC<NodeProps<StepListData>> = ({
  data,
  isConnectable
}) => {
  const rfInstance = useReactFlow();
  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);

  const dataToShow = getListNodesData(data, rfInstance);
  const isPreview = !isConnectable || !canUpdateFlow;
  const isNoteVisible = data.note && isPreview;

  return (
    <div id={data.stepId} className="node-list-container">
      <Handle style={{ top: '25px' }} type="target" position={Position.Left} />
      <div className="node-list-container__header">
        {STEP_ICONS[data.stepType]}
        <div className="node-list-container__header__text">
          <p className="node-tag">{data?.tag || NO_TAG_LABEL}</p>
          <p className="node-label">{data.name}</p>
        </div>
        {isNoteVisible && <div className="node-note__icon" />}
      </div>
      <ul className="node-list-container__list">
        {dataToShow.map((el, idx) => (
          <div
            className="node-list-container__row tooltip"
            key={`${el.id}+${idx}`}
          >
            {el.tooltipText ? (
              <div className="tooltip__content">{el.tooltipText}</div>
            ) : null}
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
      {isNoteVisible && <div className="node-note">{data.note}</div>}
      {dataToShow.length === 0 ? (
        <Handle type="source" position={Position.Right} />
      ) : null}
    </div>
  );
};

export default ListNode;
