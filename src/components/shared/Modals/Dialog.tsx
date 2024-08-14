import React from 'react';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import { Breakpoint } from '@mui/system';

import LoadingButton from '../LoadingButton';
import { CloseIcon } from '../Icons';

import { StyledDialog, StyledDialogTitle } from './styled';

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
  confirmText = 'Yes',
  cancelText = 'No',
  confirmLoading = false,
  displayedCancelBtn = true,
  displayConfirmBtn = true,
  isCloseButton = false,
  fullWidth = false,
  maxWidth,
  isConfirmBtnDisabled = false
}) => (
  <StyledDialog
    open={open}
    keepMounted
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth={fullWidth}
  >
    <StyledDialogTitle>{title}</StyledDialogTitle>
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
    <DialogContent sx={{ wordWrap: 'break-word' }}>{children}</DialogContent>
    {(displayedCancelBtn || displayConfirmBtn) && (
      <DialogActions>
        <>
          {displayConfirmBtn && (
            <LoadingButton
              loading={confirmLoading}
              disabled={confirmLoading || isConfirmBtnDisabled}
              variant="text"
              size="medium"
              onClick={onConfirm}
            >
              {confirmText}
            </LoadingButton>
          )}
          {displayedCancelBtn && (
            <Button variant="text" size="medium" onClick={onClose}>
              {cancelText}
            </Button>
          )}
        </>
      </DialogActions>
    )}
  </StyledDialog>
);
export default Dialog;
