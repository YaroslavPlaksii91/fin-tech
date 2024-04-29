import React from 'react';
import { Box, Button, Divider, Paper, Stack } from '@mui/material';

import LoadingButton from '@components/shared/LoadingButton.tsx';

const StepDetailsControlBar: React.FC<StepDetailsControlBarProps> = ({
  disabled,
  onDiscard,
  isSubmitting,
  onApplyChangesClick
}) => (
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
        <Button variant="outlined" onClick={onDiscard}>
          Cancel
        </Button>
      </Stack>
    </Box>
  </Paper>
);

interface StepDetailsControlBarProps {
  disabled?: boolean;
  isSubmitting?: boolean;
  onDiscard?: () => void;
  onApplyChangesClick: () => void;
}

export default StepDetailsControlBar;
