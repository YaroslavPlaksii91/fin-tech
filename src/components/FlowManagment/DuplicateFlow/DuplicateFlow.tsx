import { Typography } from '@mui/material';
import { useState } from 'react';

import { createDuplicateFlowData } from './createDuplicateFlowData';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import { IFlowListItem } from '@domain/flow';
import { flowService } from '@services/flow-service';
import { duplicateFlow } from '@store/flowList/asyncThunk';
import { useAppDispatch } from '@store/hooks';

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
  const dispatch = useAppDispatch();
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const handleDuplicateFlow = async () => {
    try {
      setConfirmLoading(true);
      const flowDetails = await flowService.getFlow(flow.id);
      const flowDuplicateData = createDuplicateFlowData(flowDetails);
      await dispatch(duplicateFlow(flowDuplicateData));
      handleCloseModal();
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
      title={`Duplicate flow ${flow.name}?`}
      open={modalOpen}
      onClose={handleCloseModal}
      onConfirm={handleDuplicateFlow}
      confirmLoading={confirmLoading}
    >
      <Typography width={416} variant="body2">
        Do you want to duplicate this flow with all existing steps and sub flows
        in it?
      </Typography>
    </Dialog>
  );
};
