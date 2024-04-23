import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { AppBar, IconButton, Menu, MenuItem } from '@mui/material';
import React from 'react';

// import routes from '@constants/routes';
import { ELoanLogo, PersonOutlineIcon } from '@components/shared/Icons';
// import { StyledNavLink } from '@components/shared/Link/styled';
import { authService } from '@services/auth.ts';
import { useAppSelector } from '@store/hooks.ts';
import { selectUserInfo } from '@store/auth/auth.ts';

// const pages = [
//   {
//     label: 'Flows List',
//     path: routes.underwriting.flow.list
//   },
//   { label: 'Changes History', path: routes.underwriting.changeHistory },
//   {
//     label: 'Lead Requests',
//     path: routes.underwriting.leadRequest
//   }
// ];

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
        {/* TODO: add nav link */}
        <Typography variant="h6" noWrap component="a" href="/">
          <ELoanLogo />
        </Typography>
        {/* <Box flexGrow="1" style={{ display: 'flex', justifyContent: 'center' }}>
          <Stack direction="row" spacing={8}>
            {pages.map(({ path, label }, index) => (
              <StyledNavLink key={index} to={path}>
                <HexagonOutlinedIcon />
                {label}
              </StyledNavLink>
            ))}
          </Stack>
        </Box> */}
        {/* <Avatar sx={{ bgcolor: 'gray', width: '24px', height: '24px' }}>
          <PersonOutlineIcon />
        </Avatar> */}
        <div>
          <Typography onClick={handleClick} ml={1} variant="body2" color="gray">
            {userInfo?.userName}
          </Typography>
          <IconButton color="default" size="medium">
            <PersonOutlineIcon />
          </IconButton>
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
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navigation;
