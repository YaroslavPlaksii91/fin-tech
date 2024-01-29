import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { Typography } from '@mui/material';
import { styled } from '@mui/system';

export const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  fontWeight: 600,
  boxSizing: 'border-box',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.gray}`,
  backgroundColor: theme.palette.lightGray,
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
  color: theme.palette.errorText,
  margin: '4px 14px 0 14px'
}));
