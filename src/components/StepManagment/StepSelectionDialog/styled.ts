import { styled } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';

export const StyledButtonText = styled(Typography)(({ theme }) => ({
  textAlign: 'left',
  color: theme.palette.gray,
  padding: '0 12px',
  p: {
    opacity: 0,
    maxHeight: 0,
    transition: 'max-height 0.2s, opacity 0.2s'
  }
}));

export const StyledSelectionButton = styled(Button)(({ theme }) => ({
  padding: '16px',
  border: `1px solid ${theme.palette.grayBorder}`,
  borderRadius: '8px',
  width: '416px',
  justifyContent: 'flex-start',
  color: theme.palette.gray,
  cursor: 'pointer',
  '&:not(:last-child)': {
    marginBottom: '16px'
  },
  '&:hover': {
    borderColor: theme.palette.dark,
    backgroundColor: 'transparent',
    svg: {
      color: theme.palette.dark
    },
    p: {
      opacity: 1,
      maxHeight: '100px',
      transition: 'max-height 0.2s, opacity 0.2s'
    }
  }
}));
