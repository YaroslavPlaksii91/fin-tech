import { TextareaAutosize } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
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
