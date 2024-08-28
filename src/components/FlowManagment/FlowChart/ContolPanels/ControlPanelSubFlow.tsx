import { useCallback, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import { formatFlowOnSave } from '../utils/flowUtils';
import { ControlPanelProps } from '../types';

import { StyledPanel } from './styled';

import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import { useActiveStep } from '@contexts/StepContext';
import Dialog from '@components/shared/Modals/Dialog';
import StepBreadcrumbs from '@components/StepManagment/StepDetailsHeader/StepBreadcrumbs';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';

const ControlPanelSubFlow: React.FC<ControlPanelProps> = ({
  rfInstance,
  flow,
  setCopyFlow,
  isViewMode
}) => {
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const { resetActive } = useActiveStep();
  const canUserUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isPreview = isViewMode || !canUserUpdateFlow;

  const handleDiscardChanges = () => resetActive();

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
        <StepBreadcrumbs stepId={flow.id} title={flow.data.name} />
        <Typography variant="h4">{flow.data.name}</Typography>
      </Box>
      {!isPreview && (
        <Stack spacing={1} direction="row" justifyContent="flex-end">
          <Button
            size="small"
            variant="outlined"
            onClick={() => setOpenDiscardModal(true)}
          >
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={onSave}>
            Save changes
          </Button>
        </Stack>
      )}
      <Dialog
        title="Cancel Changes"
        open={openDiscardModal}
        onConfirm={handleDiscardChanges}
        onClose={() => setOpenDiscardModal(false)}
        confirmText="Yes"
        cancelText="No"
      >
        <Typography sx={{ maxWidth: '416px' }} variant="body2">
          Canceling changes will delete all edits in this step, this action
          cannot be canceled. Are you sure you want to cancel the changes?
        </Typography>
      </Dialog>
    </StyledPanel>
  );
};

export default ControlPanelSubFlow;
