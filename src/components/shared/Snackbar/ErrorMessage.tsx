import { Stack, Typography } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';

import { ErrorOutlineOutlinedIcon } from '../Icons';

import { parseErrorMessages } from '@utils/helpers';

interface ErrorMessageProps {
  message: string;
  error: unknown;
  parsedErrors?: string[] | null;
}

const ErrorMessage = ({
  message,
  error,
  parsedErrors = null
}: ErrorMessageProps) => {
  const errors = parsedErrors || parseErrorMessages(error);
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

export default ErrorMessage;
