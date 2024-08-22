import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';

import { createDuplicateFlowData } from './createDuplicateFlowData';

import { theme } from '@theme';
import Dialog from '@components/shared/Modals/Dialog';
import { IFlowListItem } from '@domain/flow';
import { flowService } from '@services/flow-service';
import routes from '@constants/routes';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { createFlow } from '@store/flowList/asyncThunk';
import { selectUserInfo } from '@store/auth/auth';
import { getFullUserName } from '@utils/helpers';

interface DuplicateFlowProps {
  flow: IFlowListItem;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const DuplicateFlow: React.FC<DuplicateFlowProps> = ({
  flow,
  modalOpen,
  setModalOpen
}) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserInfo);

  const handleDuplicateFlow = async () => {
    const username = getFullUserName(user);
    try {
      setConfirmLoading(true);
      const flowDetails = await flowService.getFlow(flow.id);
      const flowDuplicateData = createDuplicateFlowData(flowDetails, username);
      const resultAction = await dispatch(createFlow(flowDuplicateData));
      const createdFlow = unwrapResult(resultAction);
      navigate(`${routes.underwriting.flow.list(createdFlow.id)}`);
      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`"${createdFlow.data.name}" was successfully duplicated.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
    } catch (error) {
      enqueueSnackbar(<SnackbarErrorMessage message="Error" error={error} />, {
        variant: SNACK_TYPE.ERROR
      });
    } finally {
      handleCloseModal();
      setConfirmLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Dialog
      title={`Duplicate flow ${flow.name}?`}
      open={modalOpen}
      onClose={handleCloseModal}
      onConfirm={handleDuplicateFlow}
      confirmLoading={confirmLoading}
    >
      <Typography
        width={396}
        variant="body1"
        color={theme.palette.text.secondary}
      >
        Do you want to duplicate this flow with all existing steps and sub flows
        in it?
      </Typography>
    </Dialog>
  );
};
