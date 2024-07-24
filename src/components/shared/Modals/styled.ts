import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

export const StyledDialog = styled(Dialog)(({ theme: { palette } }) => ({
  '& .MuiDialogContent-root': {
    paddingTop: '5px'
  },
  '& .MuiDialog-paper': {
    backgroundColor: palette.white,
    borderRadius: '16px'
  }
}));

export const StyledDialogTitle = styled(DialogTitle)(() => ({
  fontSize: '20px'
}));

export const StyledDialogActions = styled(DialogActions)(() => ({
  padding: '8px 16px'
}));
