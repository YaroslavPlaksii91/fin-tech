import { MaterialDesignContent } from 'notistack';
import { styled } from '@mui/material/styles';

export const StyledSnackbar = styled(MaterialDesignContent)(
  ({ theme: { palette } }) => ({
    '&.notistack-MuiContent': {
      padding: '6px 16px',
      maxWidth: '410px',
      boxSizing: 'border-box'
    },
    '&.notistack-MuiContent-success': {
      backgroundColor: palette.successBackground,
      border: `1px solid ${palette.primary.light}`,
      borderRadius: '5px',
      boxShadow: 'none'
    },
    '&.notistack-MuiContent-error': {
      backgroundColor: palette.errorBackground,
      border: `1px solid ${palette.error.main}`
    }
  })
);
