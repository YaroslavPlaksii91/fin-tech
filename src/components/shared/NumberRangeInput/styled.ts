import { styled } from '@mui/material/styles';
import { InputAdornment, TextField } from '@mui/material';

export const StyledTextField = styled(TextField)(({ theme }) => ({
  ...theme.typography.body2,
  width: '111px',
  '& .MuiInputBase-root': {
    borderRadius: '6px',
    padding: '0 8px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: `1px solid ${theme.palette.action.active}`
  },
  '& .MuiOutlinedInput-input': {
    padding: '2.5px 2px',
    textAlign: 'center',
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      appearance: '',
      margin: 0
    }
  },
  '& .MuiButtonBase-root': {
    padding: '3px'
  }
}));

export const StyledInputAdornment = styled(InputAdornment)(() => ({
  margin: 0
}));
