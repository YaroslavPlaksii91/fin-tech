import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RenameFlow } from '../RenameFlow/RenameFlowForm';
import { DeleteFlow } from '../DeleteFlow/DeleteFlow';

import { StyledIconButton } from './styled';
import Details from './Details';

import Menu from '@components/shared/Menu/Menu';
import { MoreVertIcon } from '@components/shared/Icons';
import { IFlowListItem } from '@domain/flow';
import Logger from '@utils/logger';
import routes from '@constants/routes';

enum ActionTypes {
  VIEW_FLOW_DETAILS = 'viewFlowDetails',
  VIEW_DATA_DICTIONARY = 'viewDataDictionary',
  DUPLICATE_FLOW = 'duplicateFlow',
  EDIT_FLOW = 'editFlow',
  RENAME_FLOW = 'renameFlow',
  DELETE_FLOW = 'deleteFlow'
}

const options = [
  { label: 'View flow details', dataKey: ActionTypes.VIEW_FLOW_DETAILS },
  { label: 'View data dictionary', dataKey: ActionTypes.VIEW_DATA_DICTIONARY },
  { label: 'Duplicate flow', dataKey: ActionTypes.DUPLICATE_FLOW },
  { label: 'Edit flow', dataKey: ActionTypes.EDIT_FLOW },
  { label: 'Rename flow', dataKey: ActionTypes.RENAME_FLOW },
  { label: 'Delete flow', dataKey: ActionTypes.DELETE_FLOW }
];

const ActionsMenu: React.FC<{ flow: IFlowListItem }> = ({ flow }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [modalRenameOpen, setModalRenameOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleSelectedActions = (action: ActionTypes) => {
    switch (action) {
      case ActionTypes.RENAME_FLOW:
        setModalRenameOpen(true);
        break;
      case ActionTypes.DELETE_FLOW:
        setModalDeleteOpen(true);
        break;
      case ActionTypes.VIEW_FLOW_DETAILS:
        navigate(`${routes.underwriting.flowList}/details/${flow.id}`);
        break;
      case ActionTypes.DUPLICATE_FLOW:
        Logger.info('Duplicate');
        break;
      case ActionTypes.VIEW_DATA_DICTIONARY:
        Logger.info('View data dictionary');
        break;
      case ActionTypes.EDIT_FLOW:
        Logger.info('Edit flow');
        break;
      default:
        Logger.info('Something went wrong');
    }
  };

  const handleCloseMenu = (key?: string) => {
    if (key) {
      handleSelectedActions(key as ActionTypes);
    }
    setAnchorEl(null);
  };

  return (
    <div>
      <StyledIconButton aria-label="action-menu" onClick={handleOpenMenu}>
        <MoreVertIcon />
      </StyledIconButton>
      <Menu
        anchorEl={anchorEl}
        handleCloseMenu={handleCloseMenu}
        options={options}
        footer={<Details flow={flow} />}
      />
      <RenameFlow
        flow={flow}
        modalOpen={modalRenameOpen}
        setModalOpen={setModalRenameOpen}
      />
      <DeleteFlow
        flowId={flow.id}
        modalOpen={modalDeleteOpen}
        setModalOpen={setModalDeleteOpen}
      />
    </div>
  );
};

export default ActionsMenu;
