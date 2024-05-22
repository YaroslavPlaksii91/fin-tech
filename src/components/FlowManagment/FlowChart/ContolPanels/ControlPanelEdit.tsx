import { useCallback, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';

import { formatFlowOnSave } from '../utils/formatFlowOnSave';
import { CustomReactFlowInstance } from '../types';

import { StyledPanel } from './styled';

import { IFlow } from '@domain/flow';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { saveFlow } from '@store/flow/asyncThunk';
import { pushProductionFlow } from '@store/flowList/asyncThunk';
import { selectFlowData } from '@store/flow/selectors';

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
  const flowData = useAppSelector(selectFlowData);

  const onSave = useCallback(async () => {
    if (rfInstance && flow) {
      try {
        setLoading(true);
        const formattedData = formatFlowOnSave({
          flow: { ...flow, data: flowData },
          rfInstance
        });
        const resultAction = await dispatch(saveFlow(formattedData));
        const savedFlow = unwrapResult(resultAction);
        setCopyFlow(savedFlow);

        enqueueSnackbar(
          <SnackbarMessage
            message="Success"
            details={`Changes for the "${savedFlow.data.name}" flow were successfully saved.`}
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
  }, [rfInstance, flow, flowData]);

  const onPushFlow = useCallback(async () => {
    if (rfInstance && flow) {
      try {
        setLoading(true);
        const formattedData = formatFlowOnSave({
          flow: { ...flow, data: flowData },
          rfInstance
        });
        const resultAction = await dispatch(pushProductionFlow(formattedData));
        const pushedFlow = unwrapResult(resultAction);

        enqueueSnackbar(
          <SnackbarMessage
            message="Success"
            details={`"${pushedFlow.data.name}" flow is published into the production successfully.`}
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
  }, [rfInstance, flow, flowData]);

  return (
    <StyledPanel position="top-right">
      <Box>
        <Typography variant="body1" mb={1}>
          {flowData.name}
        </Typography>
        <Typography variant="h4">{flowData.name}</Typography>
      </Box>
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
