import React, { useCallback, useState } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';

import LoadingButton from '@components/shared/Buttons/Loading';
import Dialog from '@components/shared/Dialog';
import { theme } from '@theme';

const StepDetailsControlBar: React.FC<StepDetailsControlBarProps> = ({
  isShow = true,
  isSubmitting = false,
  isEdited,
  disabled,
  resetActiveStepId,
  handleConfirm
}) => {
  const [openDiscardModal, setOpenDiscardModal] = useState(false);

  const onCancel = useCallback(() => {
    isEdited ? setOpenDiscardModal(true) : resetActiveStepId();
  }, [isEdited]);

  return (
    isShow && (
      <Box sx={{ background: theme.palette.common.white }}>
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
              loading={isSubmitting}
              type="submit"
              variant="contained"
              onClick={handleConfirm}
            >
              Save Step
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
      </Box>
    )
  );
};
interface StepDetailsControlBarProps {
  isShow?: boolean;
  isEdited: boolean;
  isSubmitting?: boolean;
  disabled?: boolean;
  handleConfirm: () => void;
  resetActiveStepId: () => void;
}

export default StepDetailsControlBar;
