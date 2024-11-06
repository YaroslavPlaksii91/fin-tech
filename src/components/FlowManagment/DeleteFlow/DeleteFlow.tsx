import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';

import { theme } from '@theme';
import Dialog from '@components/shared/Modals/Dialog';
import { useAppDispatch } from '@store/hooks';
import { deleteFlow } from '@store/flowList/asyncThunk';
import routes from '@constants/routes';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';

interface DeleteFlowProps {
  flowId: string;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const DeleteFlow: React.FC<DeleteFlowProps> = ({
  flowId,
  modalOpen,
  setModalOpen
}) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteFlow = async () => {
    try {
      setConfirmLoading(true);
      const resultAction = await dispatch(deleteFlow(flowId));
      const deletedFlow = unwrapResult(resultAction);
      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`"${deletedFlow.data.name}" was successfully deleted.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
      if (id === flowId) {
        navigate(routes.home);
        return;
      }
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
      title="Delete flow"
      open={modalOpen}
      onClose={handleCloseModal}
      onConfirm={handleDeleteFlow}
      confirmText="Delete"
      confirmLoading={confirmLoading}
    >
      <Typography
        width={396}
        variant="body1"
        color={theme.palette.text.secondary}
      >
        Are you sure you want to delete this flow with all existing steps and
        sub flows in it?
      </Typography>
    </Dialog>
  );
};
