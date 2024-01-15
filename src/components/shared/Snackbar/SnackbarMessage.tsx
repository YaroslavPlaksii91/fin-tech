import { Stack, Typography } from '@mui/material';

import { palette } from '../../../themeConfig';
import { CheckCircleOutlinedIcon, ErrorOutlineOutlinedIcon } from '../Icons';

import { parseErrorMessages } from '@utils/helpers';

interface SnackbarMessageProps {
  message: string;
  details: string;
}

interface SnackbarErrorMessageProps {
  message: string;
  error: unknown;
}

const SnackbarMessage: React.FC<SnackbarMessageProps> = ({
  message,
  details
}) => (
  <Stack>
    <Typography
      sx={{ display: 'flex', alignItems: 'center' }}
      pb={1}
      variant="h4"
      color={palette.blue}
    >
      <CheckCircleOutlinedIcon sx={{ marginRight: 1 }} size="21px" />
      {message}
    </Typography>
    <Typography variant="h6" fontWeight={400} color={palette.gray}>
      {details}
    </Typography>
  </Stack>
);

const SnackbarErrorMessage: React.FC<SnackbarErrorMessageProps> = ({
  message,
  error
}) => (
  <Stack>
    <Typography
      sx={{ display: 'flex', alignItems: 'center' }}
      pb={1}
      variant="h4"
      color={palette.blue}
    >
      <ErrorOutlineOutlinedIcon sx={{ marginRight: 1 }} size="21px" />
      {message}
    </Typography>
    <Typography variant="h6" fontWeight={400} color={palette.gray}>
      {parseErrorMessages(error)}
    </Typography>
  </Stack>
);

export { SnackbarMessage, SnackbarErrorMessage };
