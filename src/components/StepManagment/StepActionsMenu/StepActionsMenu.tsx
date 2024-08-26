import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useReactFlow } from 'reactflow';

import { RenameStep } from '../StepModals/RenameStep';

import Details from './Details';

import Menu from '@components/shared/Menu/Menu';
import {
  ActionTypes,
  getEditModeOptions,
  getOptions,
  getProductionFlowOptions
} from '@components/StepManagment/StepActionsMenu/types';
import { FlowNode } from '@domain/flow.ts';
import routes from '@constants/routes.ts';
import MoreHorizontalIcon from '@icons/moreHorizontal.svg';
import { asyncConfirmDialog } from '@components/shared/Confirmation/AsyncConfirmDialog.tsx';
import { useAppDispatch } from '@store/hooks';
import { deleteNodes, updateNodeData } from '@store/flow/flow';
import { ActiveStep } from '@contexts/StepContext';
import { permissionsMap } from '@constants/permissions';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { CUSTOM_FLOW_EVENT } from '@components/FlowManagment/FlowChart/constants';
import { removeNodesAndEdgesInSubFlow } from '@views/Subflow/utils';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { preventIdleTimeout } from '@utils/preventIdleTimeout';

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
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const nodes = getNodes();

  const menuRef: MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const [open, setIsOpen] = useState(isOpen);
  const canUserViewFlow = useHasUserPermission(permissionsMap.canViewFlow);
  const canUserUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);

  const [openRenameStepModal, setOpenRenameStepModal] =
    useState<boolean>(false);

  const options = useMemo(() => {
    if (isEditMode) {
      return getEditModeOptions({
        canUserViewFlow,
        canUserUpdateFlow
      });
    }
    if (id === PRODUCTION_FLOW_ID) {
      return getProductionFlowOptions({ canUserViewFlow });
    }
    return getOptions({ canUserViewFlow, canUserUpdateFlow });
  }, [id, isEditMode]);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  const handleMenuButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleStep = (flowNode: FlowNode | null, subFlowId: string | null) => {
    if (!flowNode) return { activeSubflowId: null, activeStepId: null };

    let activeSubflowId = subFlowId;
    let activeStepId: null | string = flowNode.id;

    if (flowNode.type === StepType.SUBFLOW) {
      activeSubflowId = flowNode.id;
      activeStepId = null;
    }

    return { activeSubflowId, activeStepId };
  };

  const handleRenameStep = useCallback(
    (name: string) => {
      if (flowNode) {
        const updatedNodes = nodes.map((node: FlowNode) => {
          if (node.id === flowNode?.id) {
            node.data = { ...node.data, name };
          }
          return node;
        });
        setNodes(updatedNodes);

        const updatedNode = { ...flowNode, data: { ...flowNode?.data, name } };
        dispatch(
          updateNodeData({
            node: updatedNode,
            flowId: '90'
          })
        );
      }
    },
    [nodes, flowNode, setNodes]
  );

  const handleSelectedActions = async (action: ActionTypes) => {
    switch (action) {
      case ActionTypes.STEP_TEXT_VIEW:
        {
          const { activeSubflowId, activeStepId } = handleStep(
            flowNode,
            subFlowId
          );
          if (!activeSubflowId && !activeStepId) return;

          navigate(routes.underwriting.flow.list(id as string), {
            state: { subFlowId: activeSubflowId, stepId: activeStepId }
          });
        }

        break;
      case ActionTypes.EDIT_STEP: {
        await preventIdleTimeout();
        const { activeSubflowId, activeStepId } = handleStep(
          flowNode,
          subFlowId
        );
        if (!activeSubflowId && !activeStepId) return;

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
        setOpenRenameStepModal(true);
        break;
      case ActionTypes.DELETE_STEP: {
        const answer = await asyncConfirmDialog({
          title: 'Delete Step?',
          message: 'Are you sure you want to delete this step from the flow?',
          confirmText: 'Delete'
        });
        if (!answer) break;

        if (!flowNode) break;

        if (flowNode.id === activeStep?.stepId) {
          setActiveStep?.({ subFlowId, stepId: null });
        }

        if (flowNode.id === activeStep?.subFlowId) {
          setActiveStep?.({ subFlowId: null, stepId: null });
        }

        if (subFlowId) {
          const updatedNodes = removeNodesAndEdgesInSubFlow(nodes, [flowNode]);
          setNodes(updatedNodes);
        }

        if (activeStep?.subFlowId) {
          document.dispatchEvent(
            new CustomEvent(CUSTOM_FLOW_EVENT, {
              detail: {
                deleteNodes: [flowNode],
                subFlowId: activeStep.subFlowId
              }
            })
          );
        } else {
          deleteElements({ nodes: [flowNode] });
        }

        dispatch(
          deleteNodes({
            deletedNodes: [flowNode]
          })
        );

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
      {openRenameStepModal && (
        <RenameStep
          initialName={flowNode.data.name}
          setModalOpen={setOpenRenameStepModal}
          modalOpen={openRenameStepModal}
          handleRenameStep={handleRenameStep}
        />
      )}
    </>
  );
};

export default StepActionsMenu;
