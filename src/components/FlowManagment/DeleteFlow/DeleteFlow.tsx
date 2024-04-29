import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { theme } from '../../../themeConfig';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import { useAppDispatch } from '@store/hooks';
import { deleteFlow } from '@store/flowList/asyncThunk';
import routes from '@constants/routes';
import { SnackbarMessage } from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import { IFlow } from '@domain/flow';

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
      const { payload } = await dispatch(deleteFlow(flowId));
      const deletedFlow = payload as IFlow;
      handleCloseModal();
      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`"${deletedFlow.data.name}" was successfully deleted.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
      if (id === flowId) {
        navigate(`${routes.underwriting.flow.list}`);
        return;
      }
    } catch (error) {
      Logger.error(error);
    } finally {
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
