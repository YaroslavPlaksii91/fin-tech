import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { useReactFlow } from 'reactflow';
import { Node } from '@reactflow/core';

import Menu from '@components/shared/Menu/Menu';
import Logger from '@utils/logger';
import {
  ActionTypes,
  editModeOptions,
  options as defaultOptions
} from '@components/StepManagment/StepActionsMenu/types';
import { FlowNode } from '@domain/flow.ts';
import routes from '@constants/routes.ts';
import { MoreHorizontal } from '@components/shared/Icons.tsx';
import { asyncConfirmDialog } from '@components/shared/Confirmation/AsyncConfirmDialog.tsx';
import { useAppDispatch } from '@store/hooks';
import { deleteNodes } from '@store/flow/flow';

interface StepActionsMenuOnNode {
  isOpen?: boolean;
  onClose?: () => void;
  anchorElement?: HTMLElement | null;
  flowNode: FlowNode | null;
  showActionMenuButton?: boolean;
  isEditMode?: boolean;
  setActiveStepId?: (activeStepId: string | null) => void;
  activeStepId: string | null;
}

const StepActionsMenu: React.FC<StepActionsMenuOnNode> = ({
  isOpen = false,
  onClose,
  anchorElement,
  flowNode,
  showActionMenuButton = false,
  isEditMode = false,
  setActiveStepId,
  activeStepId
}) => {
  const { deleteElements } = useReactFlow();
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  const menuRef: MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const [open, setIsOpen] = useState(isOpen);

  const options = isEditMode ? editModeOptions : defaultOptions;

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
        Logger.info('Step text view');
        break;
      case ActionTypes.EDIT_STEP:
        if (isEditMode) {
          flowNode && setActiveStepId?.(flowNode.id);
        } else {
          flowNode &&
            navigate(routes.underwriting.flow.edit(id as string), {
              state: { activeStepId: flowNode.id }
            });
        }
        break;

        break;
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
          if (flowNode && flowNode.id === activeStepId) {
            setActiveStepId?.(null);
          }
          deleteElements({ nodes: [flowNode as Node] });
          dispatch(deleteNodes([flowNode as FlowNode]));
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
          <MoreHorizontal />
        </IconButton>
      )}
      <Menu
        id={flowNode.id}
        anchorEl={open ? menuAnchor : null}
        handleCloseMenu={handleCloseMenu}
        options={options}
      />
    </>
  );
};

export default StepActionsMenu;
