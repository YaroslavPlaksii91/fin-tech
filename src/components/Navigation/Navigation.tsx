import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AppBar, Box, Menu, MenuItem } from '@mui/material';
import React from 'react';

import { StyledNavButton } from './styled';

import EloanLogoIcon from '@icons/eloanLogo.svg';
import UserIcon from '@icons/user.svg';
import { authService } from '@services/auth.ts';
import { useAppSelector } from '@store/hooks.ts';
import { selectUserInfo } from '@store/auth/auth.ts';
import { theme } from '@theme';

function Navigation() {
  const userInfo = useAppSelector(selectUserInfo);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="a" href="/">
          <EloanLogoIcon color={theme.palette.common.white} />
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography sx={{ padding: '0 5px' }} variant="body2">
            {userInfo?.userName}
          </Typography>
          <StyledNavButton
            variant="outlined"
            onClick={handleClick}
            size="medium"
          >
            <UserIcon color={theme.palette.common.white} />
          </StyledNavButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                authService.logout();
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
