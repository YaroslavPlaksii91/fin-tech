import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface DialogProps {
  open: boolean;
  title: string;
  onClose?: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  confirmLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  displayedCancelBtn?: boolean;
  displayConfirmBtn?: boolean;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  // confirmLoading = false,
  displayedCancelBtn = true,
  displayConfirmBtn = true
}) => (
  <MuiDialog open={open} onClose={onClose}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>
      {displayedCancelBtn && <Button onClick={onClose}>{cancelText}</Button>}
      {displayConfirmBtn && <Button onClick={onConfirm}>{confirmText}</Button>}
    </DialogActions>
  </MuiDialog>
);
export default Dialog;
