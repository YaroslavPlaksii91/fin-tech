import { useCallback, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import { formatFlowOnSave } from '../utils/formatFlowOnSave';
import { CustomReactFlowInstance } from '../types';

import { StyledPanel } from './styled';

import {
  BookmarksOutlinedIcon,
  DeleteOutlineIcon,
  TaskAltOutlinedIcon
} from '@components/shared/Icons';
import { DeleteFlow } from '@components/FlowManagment/DeleteFlow/DeleteFlow';
import { flowService } from '@services/flow-service';
import { IFlow } from '@domain/flow';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';

interface ControlPanelEditProps {
  flow: IFlow;
  isDirty: boolean;
  setFlow: (flow: IFlow) => void;
  rfInstance: CustomReactFlowInstance | undefined;
}

const ControlPanelEdit: React.FC<ControlPanelEditProps> = ({
  rfInstance,
  flow,
  isDirty,
  setFlow
}) => {
  const [modalDeleteOpen, setModalDeleteOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSave = useCallback(async () => {
    if (rfInstance && flow) {
      try {
        setLoading(true);
        const formattedData = formatFlowOnSave({ flow, rfInstance });
        const updatedFlow = await flowService.saveFlow(formattedData);
        setFlow(updatedFlow);
        enqueueSnackbar(
          <SnackbarMessage
            message="Success"
            details={`Changes for the "${flow.data.name}" flow were successfully saved.`}
          />,
          { variant: SNACK_TYPE.SUCCESS }
        );
      } catch (error) {
        enqueueSnackbar(
          <SnackbarErrorMessage message="Error" error={error} />,
          {
            variant: SNACK_TYPE.ERROR
          }
        );
      } finally {
        setLoading(false);
      }
    }
  }, [rfInstance, flow]);

  const onDelete = useCallback(() => {
    setModalDeleteOpen(true);
  }, []);

  const onPushFlow = useCallback(async () => {
    if (rfInstance && flow) {
      try {
        setLoading(true);
        const formattedData = formatFlowOnSave({ flow, rfInstance });

        await flowService.pushProductionFlow(formattedData);

        enqueueSnackbar(
          <SnackbarMessage
            message="Success"
            details={`Changes for the "${flow.data.name}" flow were successfully saved.`}
          />,
          { variant: SNACK_TYPE.SUCCESS }
        );
      } catch (error) {
        enqueueSnackbar(
          <SnackbarErrorMessage message="Error" error={error} />,
          {
            variant: SNACK_TYPE.ERROR
          }
        );
      } finally {
        setLoading(false);
      }
    }
  }, [rfInstance, flow]);

  return (
    <StyledPanel position="top-right">
      <Typography variant="h2">Edit mode</Typography>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          color="secondary"
          onClick={onDelete}
          endIcon={<DeleteOutlineIcon />}
        >
          Delete Flow
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onSave}
          endIcon={<BookmarksOutlinedIcon />}
          disabled={loading}
        >
          Save changes
        </Button>
        <Button
          variant="contained"
          disabled={isDirty}
          onClick={onPushFlow}
          endIcon={<TaskAltOutlinedIcon />}
        >
          Push changes
        </Button>
      </Stack>
      <DeleteFlow
        isEditMode
        flowId={flow.id}
        modalOpen={modalDeleteOpen}
        setModalOpen={setModalDeleteOpen}
      />
    </StyledPanel>
  );
};

export default ControlPanelEdit;
