import React from 'react';
import { Box, Button, Divider, Stack } from '@mui/material';

import LoadingButton from '@components/shared/LoadingButton.tsx';

const StepDetailsControlBar: React.FC<StepDetailsControlBarProps> = ({
  disabled,
  onDiscard,
  isSubmitting,
  onApplyChangesClick
}) => (
  <Box>
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
          type="button"
          variant="contained"
          onClick={() => onApplyChangesClick()}
        >
          Save step
        </LoadingButton>
        <Button variant="contained" color="secondary" onClick={onDiscard}>
          Cancel
        </Button>
      </Stack>
    </Box>
  </Box>
);

interface StepDetailsControlBarProps {
  disabled?: boolean;
  isSubmitting?: boolean;
  onDiscard?: () => void;
  onApplyChangesClick: () => void;
}

export default StepDetailsControlBar;
