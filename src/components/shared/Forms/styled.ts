import { TextareaAutosize, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';

export const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  boxSizing: 'border-box',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.gray}`,
  color: theme.palette.dark,
  width: '100%',
  resize: 'none',
  padding: '8px 16px',
  '&:focus': {
    borderColor: 'black'
  },
  '&:focus-visible': {
    outline: '1px solid black'
  }
}));

export const StyledError = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  margin: '4px 14px 0 14px'
}));

export const StyledInfoIcon = styled(InfoIcon)(({ theme }) => ({
  color: theme.palette.action.active,

  '&:hover': {
    color: theme.palette.info.main,
    cursor: 'pointer'
  }
}));
