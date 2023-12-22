import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import { useAppDispatch } from '@store/hooks';
import { deleteFlow } from '@store/flowList/asyncThunk';
import routes from '@constants/routes';

interface DeleteFlowProps {
  flowId: string;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  isEditMode?: boolean;
}

export const DeleteFlow: React.FC<DeleteFlowProps> = ({
  flowId,
  modalOpen,
  setModalOpen,
  isEditMode = false
}) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteFlow = async () => {
    try {
      setConfirmLoading(true);
      await dispatch(deleteFlow(flowId));
      handleCloseModal();
      if (isEditMode || id === flowId) {
        navigate(`${routes.underwriting.flowList}`);
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
      title="Delete flow?"
      open={modalOpen}
      onClose={handleCloseModal}
      onConfirm={handleDeleteFlow}
      confirmText="Delete"
      confirmLoading={confirmLoading}
    >
      <Typography width={416} variant="body2">
        Are you sure you want to delete this flow with all existing objects and
        sub flows in it?
      </Typography>
    </Dialog>
  );
};
