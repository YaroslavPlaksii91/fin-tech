import { ThemeProvider, Typography } from '@mui/material';
import { confirmable, createConfirmation } from 'react-confirm';

import { theme } from '@theme';
import Dialog from '@components/shared/Dialog';

interface AsyncConfirmDialogProps {
  show?: boolean;
  proceed?: (flag: boolean) => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const AsyncConfirmDialog = ({
  show,
  proceed,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel'
}: AsyncConfirmDialogProps) => (
  <ThemeProvider theme={theme}>
    <Dialog
      open={Boolean(show)}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={() => proceed && proceed(true)}
      onClose={() => proceed && proceed(false)}
    >
      {message && <Typography variant="body2">{message}</Typography>}
    </Dialog>
  </ThemeProvider>
);

export const asyncConfirmDialog = createConfirmation(
  confirmable(AsyncConfirmDialog)
);
