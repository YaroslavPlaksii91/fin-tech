import { MaterialDesignContent } from 'notistack';
import { styled } from '@mui/material/styles';

export const StyledSnackbar = styled(MaterialDesignContent)(({ theme }) => ({
  '&.notistack-MuiContent': {
    padding: '12px 20px',
    color: theme.palette.gray,
    maxWidth: '410px',
    boxSizing: 'border-box'
  },
  '&.notistack-MuiContent-success': {
    backgroundColor: theme.palette.successBackground,
    border: `1px solid ${theme.palette.successBorder}`,
    borderRadius: '5px'
  },
  '&.notistack-MuiContent-error': {
    backgroundColor: theme.palette.errorBackground
  }
}));
