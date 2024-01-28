import { Select } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledSelect = styled(Select)(() => ({
  paddingRight: '6px',
  '& .MuiSelect-select': {
    padding: '10px 12px'
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}));
