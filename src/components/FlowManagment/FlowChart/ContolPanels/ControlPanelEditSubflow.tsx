import { useCallback } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import { formatFlowOnSave } from '../utils/formatFlowOnSave';
import { CustomReactFlowInstance } from '../types';

import { StyledPanel } from './styled';

import { IFlow } from '@domain/flow';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';

interface ControlPanelEditProps {
  flow: IFlow;
  setCopyFlow: (flow: IFlow) => void;
  rfInstance: CustomReactFlowInstance | undefined;
}

const ControlPanelSubflowEdit: React.FC<ControlPanelEditProps> = ({
  rfInstance,
  flow,
  setCopyFlow
}) => {
  const onSave = useCallback(() => {
    if (rfInstance && flow) {
      try {
        const formattedData = formatFlowOnSave({
          flow,
          rfInstance
        });
        setCopyFlow(formattedData);

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
      }
    }
  }, [rfInstance, flow]);

  return (
    <StyledPanel position="top-right">
      <Box>
        <Typography variant="body1" mb={1}>
          {flow.data.name}
        </Typography>
        <Typography variant="h4">{flow.data.name}</Typography>
      </Box>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        <Button size="small" variant="outlined">
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={onSave}>
          Save changes
        </Button>
      </Stack>
    </StyledPanel>
  );
};

export default ControlPanelSubflowEdit;
