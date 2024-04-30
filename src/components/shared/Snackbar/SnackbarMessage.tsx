import { Stack, Typography } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';

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
    <AlertTitle
      color="primary"
      sx={{ display: 'flex', alignItems: 'center', paddingBottom: '8px' }}
    >
      <CheckCircleOutlinedIcon sx={{ marginRight: 1 }} size="21px" />
      {message}
    </AlertTitle>
    <Typography color="primary" variant="body2">
      {details}
    </Typography>
  </Stack>
);

const SnackbarErrorMessage: React.FC<SnackbarErrorMessageProps> = ({
  message,
  error
}) => {
  const errors = parseErrorMessages(error);
  return (
    <Stack>
      <AlertTitle
        color="error"
        sx={{ display: 'flex', alignItems: 'center', paddingBottom: '8px' }}
      >
        <ErrorOutlineOutlinedIcon sx={{ marginRight: 1 }} size="21px" />
        {message}
      </AlertTitle>

      {errors.map((err, idx) => (
        <Typography key={idx} variant="body2" color="error">
          {err}
        </Typography>
      ))}
    </Stack>
  );
};
export { SnackbarMessage, SnackbarErrorMessage };
