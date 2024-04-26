import { useCallback, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import { formatFlowOnSave } from '../utils/formatFlowOnSave';
import { CustomReactFlowInstance } from '../types';

import { StyledPanel } from './styled';

import { flowService } from '@services/flow-service';
import { IFlow } from '@domain/flow';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import { useAppDispatch } from '@store/hooks';
import { saveFlow } from '@store/flow/asyncThunk';

interface ControlPanelEditProps {
  flow: IFlow;
  setCopyFlow: (flow: IFlow) => void;
  isDirty: boolean;
  rfInstance: CustomReactFlowInstance | undefined;
}

const ControlPanelEdit: React.FC<ControlPanelEditProps> = ({
  rfInstance,
  flow,
  isDirty,
  setCopyFlow
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const onSave = useCallback(async () => {
    if (rfInstance && flow) {
      try {
        setLoading(true);
        const formattedData = formatFlowOnSave({ flow, rfInstance });
        const { payload } = await dispatch(saveFlow(formattedData));
        setCopyFlow(payload);

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

  const onPushFlow = useCallback(async () => {
    if (rfInstance && flow) {
      try {
        setLoading(true);
        const formattedData = formatFlowOnSave({ flow, rfInstance });

        await flowService.pushProductionFlow(formattedData);

        enqueueSnackbar(
          <SnackbarMessage
            message="Success"
            details={`"${flow.data.name}" flow is published into the production successfully.`}
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
      <Typography variant="h4">{flow.data.name}</Typography>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        <Button
          size="small"
          variant="outlined"
          onClick={onSave}
          disabled={loading}
        >
          Save changes
        </Button>
        <Button
          size="small"
          variant="contained"
          disabled={isDirty}
          onClick={onPushFlow}
        >
          Push changes
        </Button>
      </Stack>
    </StyledPanel>
  );
};

export default ControlPanelEdit;
