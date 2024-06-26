import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useReactFlow } from 'reactflow';

import Details from './Details';

import Menu from '@components/shared/Menu/Menu';
import Logger from '@utils/logger';
import {
  ActionTypes,
  getEditModeOptions,
  getOptions
} from '@components/StepManagment/StepActionsMenu/types';
import { FlowNode } from '@domain/flow.ts';
import routes from '@constants/routes.ts';
import MoreHorizontalIcon from '@icons/moreHorizontal.svg';
import { asyncConfirmDialog } from '@components/shared/Confirmation/AsyncConfirmDialog.tsx';
import { useAppDispatch } from '@store/hooks';
import { deleteNodes } from '@store/flow/flow';
import { ActiveStep } from '@contexts/StepContext';
import { permissionsMap } from '@constants/permissions';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { StepType } from '@components/FlowManagment/FlowChart/types';

interface StepActionsMenuOnNode {
  isOpen?: boolean;
  onClose?: () => void;
  subFlowId: string | null;
  anchorElement?: HTMLElement | null;
  flowNode: FlowNode | null;
  showActionMenuButton?: boolean;
  isEditMode?: boolean;
  activeStep?: ActiveStep;
  setActiveStep?: (value: ActiveStep) => void;
}

const StepActionsMenu: React.FC<StepActionsMenuOnNode> = ({
  isOpen = false,
  onClose,
  anchorElement,
  flowNode,
  showActionMenuButton = false,
  isEditMode = false,
  subFlowId = null,
  setActiveStep,
  activeStep
}) => {
  const { getNodes, setNodes, deleteElements } = useReactFlow();
  // const { deleteElements } = useReactFlow();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const nodes = getNodes();

  const menuRef: MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const [open, setIsOpen] = useState(isOpen);
  const canUserViewFlow = useHasUserPermission(permissionsMap.canViewFlow);
  const canUserUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);

  const options = isEditMode
    ? getEditModeOptions({
        canUserViewFlow,
        canUserUpdateFlow
      })
    : getOptions({ canUserViewFlow, canUserUpdateFlow });

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  const handleMenuButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelectedActions = async (action: ActionTypes) => {
    switch (action) {
      case ActionTypes.STEP_TEXT_VIEW:
        navigate(routes.underwriting.flow.view(id as string), {
          state: { subFlowId, stepId: flowNode?.id }
        });
        flowNode && setActiveStep?.({ subFlowId, stepId: flowNode.id });

        break;
      case ActionTypes.EDIT_STEP: {
        if (!flowNode) return;
        let activeSubflowId = subFlowId;
        let activeStepId: null | string = flowNode.id;

        if (flowNode.type === StepType.SUBFLOW) {
          activeSubflowId = flowNode.id;
          activeStepId = null;
        }
        if (isEditMode) {
          setActiveStep?.({
            subFlowId: activeSubflowId,
            stepId: activeStepId
          });
        } else {
          navigate(routes.underwriting.flow.edit(id as string), {
            state: { subFlowId: activeSubflowId, stepId: activeStepId }
          });
        }
        break;
      }

      case ActionTypes.RENAME_STEP:
        Logger.info('Rename step');
        break;
      case ActionTypes.DUPLICATE_STEP:
        Logger.info('Duplicate step');
        break;
      case ActionTypes.DELETE_STEP: {
        const answer = await asyncConfirmDialog({
          title: 'Delete Step?',
          message: 'Are you sure you want to delete this step from the flow?',
          confirmText: 'Delete'
        });
        if (answer) {
          if (flowNode && flowNode.id === activeStep?.stepId) {
            setActiveStep?.({ subFlowId, stepId: null });
          }
          if (flowNode && flowNode.id === activeStep?.subFlowId) {
            setActiveStep?.({ subFlowId: null, stepId: null });
          }
          if (flowNode) {
            if (subFlowId) {
              const updatedNodes = removeNodesInSubflow(
                nodes,
                [flowNode],
                subFlowId
              );
              setNodes(updatedNodes);
            } else {
              deleteElements({ nodes: [flowNode] });
            }

            dispatch(
              deleteNodes({
                deletedNodes: [flowNode],
                flowId: subFlowId
              })
            );
          }
        }
        break;
      }
      default:
    }
  };

  const handleCloseMenu = async (key?: string) => {
    if (key) {
      await handleSelectedActions(key as ActionTypes);
    }
    setIsOpen(false);
    onClose && onClose();
  };

  const menuAnchor = anchorElement || menuRef.current;

  if (!flowNode) {
    return null;
  }

  return (
    <>
      {showActionMenuButton && (
        <IconButton
          ref={menuRef}
          onClick={handleMenuButtonClick}
          size="small"
          sx={{ padding: 0 }}
        >
          <MoreHorizontalIcon />
        </IconButton>
      )}
      <Menu
        id={flowNode.id}
        anchorEl={open ? menuAnchor : null}
        handleCloseMenu={handleCloseMenu}
        options={options}
        footer={<Details data={flowNode.data} />}
      />
    </>
  );
};

function removeNodesInSubflow(
  nodes: FlowNode[],
  deleteNodes: FlowNode[],
  subflowId: string | null
): FlowNode[] {
  return nodes.map((node) => {
    if (node.id === subflowId) {
      return {
        ...node,
        data: {
          ...node.data,
          edges: node.data.edges?.filter(
            (edge) =>
              !deleteNodes.find(
                (item) => item.id === edge.source || item.id === edge.target
              )
          ),
          nodes: node.data?.nodes?.filter(
            (node) => !deleteNodes.find((item) => item.id === node.id)
          )
        }
      };
    } else if (node.data.nodes) {
      return {
        ...node,
        nodes: removeNodesInSubflow(node.data.nodes, deleteNodes, subflowId)
      };
    }
    return node;
  });
}

export default StepActionsMenu;
