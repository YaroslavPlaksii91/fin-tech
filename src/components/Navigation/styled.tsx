import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

import { palette } from '@theme';

const headerButtonStyles = {
  borderRadius: '6px',
  color: `${palette.white} !important`,
  backgroundColor: '#FFFFFF14',
  border: '1px solid rgba(225, 225, 225, 0.5) !important'
};

export const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: palette.primaryDark,
  padding: '12px 24px 12px 16px',
  boxShadow: 'none'
}));

export const StyledHeaderIconButton = styled(IconButton)(() => ({
  padding: '0px',
  width: '30px',
  height: '30px',
  ...headerButtonStyles,

  '&::after': {
    content: '""',
    display: 'block',
    paddingBottom: '100%'
  }
}));

export const StyledHeaderButton = styled(Button)(() => ({
  padding: '4px 10px',
  textTransform: 'capitalize',
  fontSize: '13px',
  lineHeight: '20px',
  ...headerButtonStyles
}));
