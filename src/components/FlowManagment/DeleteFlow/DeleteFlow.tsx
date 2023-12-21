import { Typography } from '@mui/material';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import { IFlowListItem } from '@domain/flow';
import { useAppDispatch } from '@store/hooks';
import { deleteFlow } from '@store/flowList/asyncThunk';

interface DeleteFlowProps {
  flow: IFlowListItem;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

export const DeleteFlow: React.FC<DeleteFlowProps> = ({
  flow,
  modalOpen,
  setModalOpen
}) => {
  const dispatch = useAppDispatch();

  const handleDeleteFlow = async () => {
    try {
      await dispatch(deleteFlow(flow.id));
      handleCloseModal();
    } catch (error) {
      Logger.error(error);
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
    >
      <Typography width={416} variant="body2">
        Are you sure you want to delete this flow with all existing objects and
        sub flows in it?
      </Typography>
    </Dialog>
  );
};
