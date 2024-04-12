import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { Breakpoint } from '@mui/system';

import LoadingButton from '../LoadingButton';
import { CloseIcon } from '../Icons';

interface DialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  displayedCancelBtn?: boolean;
  displayConfirmBtn?: boolean;
  isCloseButton?: boolean;
  fullWidth?: boolean;
  maxWidth?: Breakpoint | false;
  isConfirmBtnDisabled?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
  displayedCancelBtn = true,
  displayConfirmBtn = true,
  isCloseButton = false,
  fullWidth = false,
  maxWidth,
  isConfirmBtnDisabled = false
}) => (
  <MuiDialog
    open={open}
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth={fullWidth}
  >
    <DialogTitle>{title}</DialogTitle>
    {isCloseButton && (
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16
        }}
      >
        <CloseIcon />
      </IconButton>
    )}
    <DialogContent>{children}</DialogContent>
    {(displayedCancelBtn || displayConfirmBtn) && (
      <DialogActions>
        {displayedCancelBtn && (
          <Button variant="contained" color="secondary" onClick={onClose}>
            {cancelText}
          </Button>
        )}
        {displayConfirmBtn && (
          <LoadingButton
            loading={confirmLoading}
            disabled={confirmLoading || isConfirmBtnDisabled}
            variant="contained"
            color="primary"
            onClick={onConfirm}
          >
            {confirmText}
          </LoadingButton>
        )}
      </DialogActions>
    )}
  </MuiDialog>
);
export default Dialog;
