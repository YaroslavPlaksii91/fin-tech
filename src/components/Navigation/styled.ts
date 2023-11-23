import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Button, { ButtonProps } from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { SvgIconProps } from '@mui/material/SvgIcon';

export const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.lightGray,
  padding: '0 8px',
  boxShadow: 'none'
}));

export const StyledKeyboardArrowDownIcon = styled(KeyboardArrowDownIcon)<
  SvgIconProps & { isOpen: boolean }
>(({ isOpen }) => ({
  transform: 'rotate(0deg)',
  transition: 'transform 0.3s ease',
  ...(isOpen && {
    transform: 'rotate(180deg)'
  })
}));

export const StyledButton = styled(Button)<ButtonProps & { isOpen: boolean }>(
  ({ theme, isOpen }) => ({
    color: theme.palette.gray,
    background: 'none',
    '&:hover': {
      backgroundColor: 'transparent'
    },
    ...(isOpen && {
      backgroundColor: theme.palette.gray,
      color: theme.palette.secondary.contrastText
    })
  })
);
