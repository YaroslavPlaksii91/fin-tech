import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { Divider, Typography } from '@mui/material';

import {
  StyledAppBar,
  StyledHeaderButton,
  StyledHeaderIconButton
} from './styled';

import LogoutIcon from '@icons/log-out.svg';
import LogoIcon from '@icons/eloanLogo.svg';
import UserIcon from '@icons/user.svg';
import { authService } from '@services/auth';
import { palette } from '@theme';
import routes from '@constants/routes';
import Dialog from '@components/shared/Dialog';
import { selectUserInfo } from '@store/auth';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchUserInfo } from '@store/auth/asyncThunk';
import { clearStoredState } from '@utils/localeStorage';
import {
  EXPANDED_FLOW_LIST_KEY,
  EXPANDED_REPORTS_KEY
} from '@components/Sidebar/config';

function Navigation() {
  const [openModal, setOpenModal] = useState(false);
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchUserInfo());
  }, [dispatch]);

  return (
    <>
      <StyledAppBar>
        <Stack
          justifyContent="space-between"
          height="100%"
          direction="row"
          alignItems="center"
          gap={2}
        >
          <Stack direction="row" gap="16px" alignItems="center">
            <Link
              component={RouterLink}
              to={routes.home}
              sx={{ display: 'flex' }}
            >
              <LogoIcon height={40} color={palette.white} />
            </Link>
            <Divider variant="middle" orientation="vertical" flexItem />
            <Typography>Underwriting</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <StyledHeaderButton
              startIcon={<UserIcon width={18} height={18} />}
              variant="outlined"
              sx={{ cursor: 'auto' }}
              disabled
            >
              {userInfo?.userName}
            </StyledHeaderButton>
            <StyledHeaderIconButton onClick={() => setOpenModal(true)}>
              <LogoutIcon color={palette.white} />
            </StyledHeaderIconButton>
          </Stack>
        </Stack>
      </StyledAppBar>
      {openModal && (
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          onConfirm={() => {
            clearStoredState([EXPANDED_FLOW_LIST_KEY, EXPANDED_REPORTS_KEY]);
            void authService.logout();
          }}
          title="Log out"
          cancelText="Cancel"
          maxWidth="xs"
        >
          Do you want to log out from your account?
        </Dialog>
      )}
    </>
  );
}

export default Navigation;
