import { Stack, Typography } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';

import CheckCircleIcon from '@icons/checkCircle.svg';
import { theme } from '@theme';

interface MessageProps {
  message: string;
  details: string;
}

const Message = ({ message, details }: MessageProps) => (
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

export default Message;
