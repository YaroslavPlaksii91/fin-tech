import React from 'react';
import { ThemeProvider, Typography } from '@mui/material';
import { confirmable, createConfirmation } from 'react-confirm';

import { theme } from '@theme';
import Dialog from '@components/shared/Modals/Dialog.tsx';

const AsyncConfirmDialog: React.FC<AsyncConfirmDialogProps> = ({
  show,
  proceed,
  title,
  message,
  confirmText = 'Yes',
  cancelText = 'Cancel'
}) => (
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

interface AsyncConfirmDialogProps {
  show?: boolean;
  proceed?: (flag: boolean) => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

export const asyncConfirmDialog = createConfirmation(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  confirmable(AsyncConfirmDialog)
);
