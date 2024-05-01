import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';

import { RenameFlow } from '../RenameFlow/RenameFlowForm';
import { DeleteFlow } from '../DeleteFlow/DeleteFlow';
import { DuplicateFlow } from '../DuplicateFlow/DuplicateFlow';

import Details from './Details';

import { theme } from '@theme';
import Menu from '@components/shared/Menu/Menu';
import { IFlowListItem } from '@domain/flow';
import Logger from '@utils/logger';
import routes from '@constants/routes';
import {
  Books,
  CopyAlt,
  Edit,
  FileEdit,
  MoreHorizontal,
  Trash
} from '@components/shared/Icons';

enum ActionTypes {
  VIEW_DATA_DICTIONARY = 'viewDataDictionary',
  DUPLICATE_FLOW = 'duplicateFlow',
  EDIT_FLOW = 'editFlow',
  RENAME_FLOW = 'renameFlow',
  DELETE_FLOW = 'deleteFlow'
}

const options = [
  {
    label: 'View Data Dictionary',
    dataKey: ActionTypes.VIEW_DATA_DICTIONARY,
    icon: <Books />
  },
  {
    label: 'Duplicate',
    dataKey: ActionTypes.DUPLICATE_FLOW,
    icon: <CopyAlt />
  },
  { label: 'Edit', dataKey: ActionTypes.EDIT_FLOW, icon: <Edit /> },
  {
    label: 'Rename',
    dataKey: ActionTypes.RENAME_FLOW,
    icon: <FileEdit />
  },
  {
    label: 'Delete',
    dataKey: ActionTypes.DELETE_FLOW,
    icon: <Trash />,
    textColor: theme.palette.error.main
  }
];

const ActionsMenu: React.FC<{ flow: IFlowListItem }> = ({ flow }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [modalRenameOpen, setModalRenameOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [modalDuplicateOpen, setModalDuplicateOpen] = useState<boolean>(false);
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
      case ActionTypes.DUPLICATE_FLOW:
        setModalDuplicateOpen(true);
        break;
      case ActionTypes.VIEW_DATA_DICTIONARY:
        navigate(routes.underwriting.flow.dataDictionary(flow.id));
        break;
      case ActionTypes.EDIT_FLOW: {
        navigate(routes.underwriting.flow.edit(flow.id));
        break;
      }
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
    <>
      <IconButton
        sx={{ padding: 0 }}
        size="small"
        aria-label="action-menu"
        onClick={handleOpenMenu}
      >
        <MoreHorizontal />
      </IconButton>
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
      <DuplicateFlow
        flow={flow}
        modalOpen={modalDuplicateOpen}
        setModalOpen={setModalDuplicateOpen}
      />
    </>
  );
};

export default ActionsMenu;
