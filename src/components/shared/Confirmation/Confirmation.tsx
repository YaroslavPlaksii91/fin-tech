import { useCallback } from 'react';
import { useBlocker, useBeforeUnload } from 'react-router-dom';
import { Typography } from '@mui/material';

import Dialog from '@components/shared/Modals/Dialog';
import { ROURER_BLOCKED_STATE } from '@constants/common';

interface ConfirmationDialogProps {
  isDirty: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isDirty,
  confirmText = 'Yes',
  cancelText = 'No',
  title = 'Leave page?',
  message = 'Changes that you made not be saved.'
}) => {
  const blocker = useBlocker(isDirty);

  const handleClose = useCallback(() => {
    if (blocker.state === ROURER_BLOCKED_STATE) {
      blocker.reset();
    }
  }, [blocker]);

  const handleConfirm = useCallback(() => {
    if (blocker.state === ROURER_BLOCKED_STATE) {
      blocker.proceed();
    }
  }, [blocker]);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault();
          event.returnValue = true;
        }
      },
      [isDirty]
    )
  );

  return (
    <Dialog
      open={blocker.state === ROURER_BLOCKED_STATE}
      title={title}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={handleConfirm}
      onClose={handleClose}
    >
      <Typography variant="body2">{message}</Typography>
    </Dialog>
  );
};

export default ConfirmationDialog;
