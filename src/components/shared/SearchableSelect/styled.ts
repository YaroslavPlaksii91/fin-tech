import { InputLabel, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledSelect = styled(Select)(() => ({
  paddingRight: '6px',
  width: '100%',
  '& .MuiSelect-select': {
    padding: '10px 12px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}));

export const StyledInputLabel = styled(InputLabel)(() => ({
  fontSize: '14px',
  transform: 'none',
  left: '12px',
  top: '10px'
}));
