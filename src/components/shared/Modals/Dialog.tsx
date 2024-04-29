import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { IconButton, Typography } from '@mui/material';
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
    <Typography pt={2} pl={3} pr={3} variant="h6">
      {title}
    </Typography>
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
        <>
          {displayConfirmBtn && (
            <LoadingButton
              loading={confirmLoading}
              disabled={confirmLoading || isConfirmBtnDisabled}
              variant="text"
              onClick={onConfirm}
            >
              {confirmText}
            </LoadingButton>
          )}
          {displayedCancelBtn && (
            <Button variant="text" onClick={onClose}>
              {cancelText}
            </Button>
          )}
        </>
      </DialogActions>
    )}
  </MuiDialog>
);
export default Dialog;
