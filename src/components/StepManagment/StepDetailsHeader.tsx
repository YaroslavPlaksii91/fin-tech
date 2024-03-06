import { Button, Stack, Typography } from '@mui/material';

import { palette } from '../../themeConfig';

import LoadingButton from '@components/shared/LoadingButton';

interface StepDetailsHeaderProps {
  title: string;
  details: string;
  isActionContainerVisible?: boolean;
  disabled: boolean;
  isSubmitting: boolean;
  onDiscard: () => void;
  buttonType?: 'button' | 'submit' | undefined;
  onApplyChangesClick?: () => void;
}

const StepDetailsHeader: React.FC<StepDetailsHeaderProps> = ({
  title,
  details,
  onDiscard,
  disabled,
  isActionContainerVisible = true,
  isSubmitting,
  buttonType,
  onApplyChangesClick
}) => (
  <Stack
    flexDirection="row"
    justifyContent="space-between"
    alignItems="flex-start"
    sx={{ padding: '16px 24px' }}
  >
    <Stack>
      <Typography variant="h2">{title}</Typography>
      <Typography variant="body2" color={palette.gray}>
        {details}
      </Typography>
    </Stack>
    {isActionContainerVisible && (
      <>
        <Button
          sx={{ margin: '0px 8px 0 auto' }}
          variant="contained"
          color="secondary"
          onClick={onDiscard}
        >
          Discard
        </Button>
        <LoadingButton
          disabled={disabled}
          loading={isSubmitting}
          type={buttonType}
          variant="contained"
          onClick={() => (onApplyChangesClick ? onApplyChangesClick() : null)}
        >
          Apply changes
        </LoadingButton>
      </>
    )}
  </Stack>
);

export default StepDetailsHeader;
