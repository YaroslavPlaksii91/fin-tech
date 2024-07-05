import { AppBar, Button, IconButton } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

import { palette } from '@theme';

export const StyledNavButton = styled(Button)(({ theme: { palette } }) => ({
  borderColor: alpha(palette.common.white, 0.5),
  padding: '5px',
  minWidth: '36px',
  '&:hover': {
    borderColor: palette.common.white
  }
}));

export const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: palette.primaryDark,
  position: 'fixed',
  padding: '12px 24px 12px 16px',
  boxShadow: 'none'
}));

export const StyledHeaderButton = styled(IconButton)(() => ({
  padding: '4px',
  borderRadius: '6px',
  border: '1px solid rgba(225, 225, 225, 0.5)'
}));
