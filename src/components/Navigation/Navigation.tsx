import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Menu, MenuItem, Stack } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { StyledAppBar, StyledLinkText } from './styled';

import routes from '@constants/routes';
import {
  HexagonOutlinedIcon,
  Logo,
  PersonOutlineIcon
} from '@components/shared/Icons';
import { StyledNavLink } from '@components/shared/Link/styled';
import { authService } from '@services/auth.ts';
import { useAppSelector } from '@store/hooks.ts';
import { selectUserInfo } from '@store/auth/auth.ts';

const pages = [
  {
    label: 'Flows List',
    path: routes.underwriting.flow.list
  },
  { label: 'Changes History', path: routes.underwriting.changeHistory },
  {
    label: 'Lead Requests',
    path: routes.underwriting.leadRequest
  }
];

function Navigation() {
  const userInfo = useAppSelector(selectUserInfo);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters>
          {/* TODO: add nav link */}
          <Typography variant="h6" noWrap component="a" href="/">
            <Logo />
          </Typography>
          <Box
            flexGrow="1"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Stack direction="row" spacing={8}>
              {pages.map(({ path, label }, index) => (
                <StyledNavLink key={index} to={path}>
                  <StyledLinkText variant="h6">
                    <HexagonOutlinedIcon />
                    {label}
                  </StyledLinkText>
                </StyledNavLink>
              ))}
            </Stack>
          </Box>
          <Avatar sx={{ bgcolor: 'gray', width: '24px', height: '24px' }}>
            <PersonOutlineIcon />
          </Avatar>
          <Typography onClick={handleClick} ml={1} variant="body2" color="gray">
            {userInfo?.userName}
          </Typography>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem
              onClick={() => {
                authService.logout(() => {
                  navigate(routes.index);
                });
                handleClose();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}

export default Navigation;
