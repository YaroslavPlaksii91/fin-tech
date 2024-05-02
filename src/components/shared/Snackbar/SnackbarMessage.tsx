import { Stack, Typography } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';

import { CheckCircle, ErrorOutlineOutlinedIcon } from '../Icons';

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
  <Stack display="flex" flexDirection="row" gap={1.5}>
    <CheckCircle />
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
