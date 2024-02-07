import { Button, Stack, Typography } from '@mui/material';

import { palette } from '../../themeConfig';

interface StepDetailsHeaderProps {
  title: string;
  details: string;
  disabled?: boolean;
  onDiscard?: () => void;
  isActionContainerVisible?: boolean;
}

const StepDetailsHeader: React.FC<StepDetailsHeaderProps> = ({
  title,
  details,
  onDiscard,
  disabled,
  isActionContainerVisible = true
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
        <Button disabled={disabled} variant="contained" type="submit">
          Apply changes
        </Button>
      </>
    )}
  </Stack>
);

export default StepDetailsHeader;
