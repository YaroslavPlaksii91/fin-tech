import { Stack, Typography } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';

import { ErrorOutlineOutlinedIcon } from '../Icons';

import CheckCircleIcon from '@icons/checkCircle.svg';
import { parseErrorMessages } from '@utils/helpers';
import { theme } from '@theme';

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
  <Stack display="flex" flexDirection="row" gap={1.5}>
    <CheckCircleIcon color={theme.palette.primary.main} />
    <Stack display="flex" flexDirection="column">
      <AlertTitle color="primary">{message}</AlertTitle>
      <Typography color="primary" variant="body2">
        {details}
      </Typography>
    </Stack>
  </Stack>
);

const SnackbarErrorMessage: React.FC<SnackbarErrorMessageProps> = ({
  message,
  error
}) => {
  const errors = parseErrorMessages(error);
  return (
    <Stack display="flex" flexDirection="row" gap={1.5}>
      <ErrorOutlineOutlinedIcon color="error" />
      <Stack display="flex" flexDirection="column">
        <AlertTitle color="error">{message}</AlertTitle>
        {errors.map((err, idx) => (
          <Typography key={idx} variant="body2" color="error">
            {err}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
};
export { SnackbarMessage, SnackbarErrorMessage };
