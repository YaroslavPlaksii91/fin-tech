import { InputLabel, Select, SvgIconProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const StyledSelect = styled(Select)(() => ({
  paddingRight: '6px',
  width: '100%',
  fontSize: '14px',
  '& .MuiSelect-select': {
    padding: 0
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none'
  }
}));

export const StyledInputLabel = styled(InputLabel)(() => ({
  fontSize: '14px',
  transform: 'none',
  left: 0,
  top: 0
}));

export const DownIcon = styled(KeyboardArrowDownIcon)<
  SvgIconProps & { open: boolean }
>(({ open }) => ({
  userSelect: 'none',
  display: 'inline-block',
  position: 'absolute',
  right: '7px',
  top: 'calc(50% - 0.5em)',
  pointerEvents: 'none',
  transform: 'rotate(0deg)',
  transition: 'transform 0.3s ease',
  ...(open && {
    transform: 'rotate(180deg)'
  })
}));
