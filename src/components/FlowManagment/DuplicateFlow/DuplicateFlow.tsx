import { Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createDuplicateFlowData } from './createDuplicateFlowData';

import Dialog from '@components/shared/Modals/Dialog';
import Logger from '@utils/logger';
import { IFlowListItem } from '@domain/flow';
import { flowService } from '@services/flow-service';
import routes from '@constants/routes';

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

  const handleDuplicateFlow = async () => {
    try {
      setConfirmLoading(true);
      const flowDetails = await flowService.getFlow(flow.id);
      const flowDuplicateData = createDuplicateFlowData(flowDetails);
      const { id } = await flowService.createFlow(flowDuplicateData);
      navigate(routes.underwriting.flow.details(id));
    } catch (error) {
      Logger.error(error);
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
      <Typography width={416} variant="body2">
        Do you want to duplicate this flow with all existing steps and sub flows
        in it?
      </Typography>
    </Dialog>
  );
};
