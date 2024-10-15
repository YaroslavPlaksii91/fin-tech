import { styled } from '@mui/material/styles';
import { InputAdornment, TextField } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    width: '126px',
    borderRadius: '6px',
    padding: '0'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: `1px solid ${theme.palette.action.active}`
  },
  '& .MuiOutlinedInput-input': {
    ...theme.typography.body2,
    padding: '2.5px 2px',
    textAlign: 'center'
  },
  '& .MuiButtonBase-root': {
    padding: '3px'
  }
}));

export const StyledInputAdornment = styled(InputAdornment)(() => ({
  margin: 0
}));
