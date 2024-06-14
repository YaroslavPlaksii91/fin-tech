import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';

import { RenameFlow } from '../RenameFlow/RenameFlowForm';
import { DeleteFlow } from '../DeleteFlow/DeleteFlow';
import { DuplicateFlow } from '../DuplicateFlow/DuplicateFlow';

import Details from './Details';
import {
  ActionTypes,
  getOptionsDraftFlow,
  getOptionsProductionFlow
} from './options';

import Menu from '@components/shared/Menu/Menu';
import { IFlowListItem } from '@domain/flow';
import Logger from '@utils/logger';
import routes from '@constants/routes';
import MoreHorizontalIcon from '@icons/moreHorizontal.svg';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { theme } from '@theme';
import { permissionsMap } from '@constants/permissions';
import { useHasUserPermission } from '@hooks/useHasUserPermission';

const ActionsMenu: React.FC<{
  flow: IFlowListItem;
  isProductionFlow?: boolean;
}> = ({ flow, isProductionFlow = false }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [modalRenameOpen, setModalRenameOpen] = useState<boolean>(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [modalDuplicateOpen, setModalDuplicateOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const canUserViewFlow = useHasUserPermission(permissionsMap.canViewFlow);
  const canUserUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);

  const options = useMemo(
    () =>
      isProductionFlow
        ? getOptionsProductionFlow({ canUserViewFlow })
        : getOptionsDraftFlow({ canUserViewFlow, canUserUpdateFlow }),
    [isProductionFlow, canUserViewFlow, canUserUpdateFlow]
  );

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
      case ActionTypes.VIEW_DATA_DICTIONARY: {
        const id = isProductionFlow ? PRODUCTION_FLOW_ID : flow.id;
        navigate(routes.underwriting.flow.dataDictionary(id));
        break;
      }

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
        <MoreHorizontalIcon color={theme.palette.action.active} />
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
