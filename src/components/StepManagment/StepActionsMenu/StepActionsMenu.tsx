import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';

import Menu from '@components/shared/Menu/Menu';
import Logger from '@utils/logger';
import {
  ActionTypes,
  options
} from '@components/StepManagment/StepActionsMenu/types';
import { FlowNode } from '@domain/flow.ts';
import routes from '@constants/routes.ts';
import { MoreVertIcon } from '@components/shared/Icons.tsx';

interface StepActionMenuOnNode {
  isOpen?: boolean;
  onClose?: () => void;
  anchorElement?: HTMLElement | null;
  flowNode: FlowNode | null;
  showActionMenuButton?: boolean;
}

const StepActionMenu: React.FC<StepActionMenuOnNode> = ({
  isOpen = false,
  onClose,
  anchorElement,
  flowNode,
  showActionMenuButton = false
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const menuRef: MutableRefObject<HTMLButtonElement | null> = useRef(null);
  const [open, setIsOpen] = useState(isOpen);

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  const handleMenuButtonClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleSelectedActions = (action: ActionTypes) => {
    switch (action) {
      case ActionTypes.STEP_TEXT_VIEW:
        Logger.info('Step text view');
        break;
      case ActionTypes.EDIT_STEP:
        navigate(routes.underwriting.flow.edit(id as string), {
          state: { node: flowNode }
        });
        break;
      case ActionTypes.RENAME_STEP:
        Logger.info('Rename step');
        break;
      case ActionTypes.DUPLICATE_STEP:
        Logger.info('Duplicate step');
        break;
      default:
    }
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      handleSelectedActions(key as ActionTypes);
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
        <IconButton ref={menuRef} onClick={handleMenuButtonClick}>
          <MoreVertIcon />
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

export default StepActionMenu;
