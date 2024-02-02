import { InputLabel, Select } from '@mui/material';
import { styled } from '@mui/material/styles';

import { StyledKeyboardArrowDownIcon } from '@components/Navigation/styled';

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

export const DownIcon = styled(StyledKeyboardArrowDownIcon)(() => ({
  userSelect: 'none',
  display: 'inline-block',
  position: 'absolute',
  right: '7px',
  top: 'calc(50% - 0.5em)',
  pointerEvents: 'none'
}));
