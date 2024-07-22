import React, { useCallback, useState } from 'react';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';

import LoadingButton from '@components/shared/LoadingButton.tsx';
import Dialog from '@components/shared/Modals/Dialog';

const StepDetailsControlBar: React.FC<StepDetailsControlBarProps> = ({
  disabled,
  resetActiveStepId,
  isSubmitting,
  onApplyChangesClick,
  isShow = true,
  isEdited
}) => {
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  const onCancel = useCallback(() => {
    isEdited ? setOpenDiscardModal(true) : resetActiveStepId();
  }, [isEdited]);

  return (
    isShow && (
      <Paper elevation={1}>
        <Divider />
        <Box px={3} py={2}>
          <Stack
            flexDirection="row"
            justifyContent="end"
            alignItems="flex-start"
            gap={1}
          >
            <LoadingButton
              disabled={disabled}
              loading={Boolean(isSubmitting)}
              type="submit"
              variant="contained"
              onClick={() => onApplyChangesClick()}
            >
              Save step
            </LoadingButton>

            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </Stack>
        </Box>
        <Dialog
          title="Cancel Changes"
          open={openDiscardModal}
          onConfirm={resetActiveStepId}
          onClose={() => setOpenDiscardModal(false)}
          confirmText="Yes"
          cancelText="No"
        >
          <Typography sx={{ maxWidth: '416px' }} variant="body2">
            Canceling changes will delete all edits in this step, this action
            cannot be canceled. Are you sure you want to cancel the changes?
          </Typography>
        </Dialog>
      </Paper>
    )
  );
};
interface StepDetailsControlBarProps {
  disabled?: boolean;
  isSubmitting?: boolean;
  onApplyChangesClick: () => void;
  resetActiveStepId: () => void;
  isEdited: boolean;
  isShow?: boolean;
}

export default StepDetailsControlBar;
