import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

import {
  StyledAppBar,
  StyledHeaderButton,
  StyledHeaderIconButton
} from './styled';

import LogoutIcon from '@icons/log-out.svg';
import LogoIcon from '@icons/eloanLogo.svg';
import UserIcon from '@icons/user.svg';
import { authService } from '@services/auth.ts';
import { palette } from '@theme';
import routes from '@constants/routes';
import Dialog from '@components/shared/Modals/Dialog';
import { getFullUserName } from '@utils/helpers';
import { fetchUserInfo, selectUserInfo } from '@store/auth/auth.ts';
import { useAppDispatch, useAppSelector } from '@store/hooks.ts';

function Navigation() {
  const [openModal, setOpenModal] = useState<boolean>(false);
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
          <Link
            component={RouterLink}
            to={routes.index}
            sx={{ display: 'flex' }}
          >
            <LogoIcon height={40} color={palette.white} />
          </Link>
          <Stack direction="row" alignItems="center" gap={1}>
            <StyledHeaderButton
              startIcon={<UserIcon />}
              variant="outlined"
              sx={{ cursor: 'auto' }}
              disableRipple
            >
              {userInfo && getFullUserName(userInfo)}
            </StyledHeaderButton>
            <StyledHeaderIconButton onClick={() => setOpenModal(true)}>
              <LogoutIcon color={palette.white} />
            </StyledHeaderIconButton>
          </Stack>
        </Stack>
      </StyledAppBar>
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={() => void authService.logout()}
        title="Sign out"
        maxWidth="xs"
      >
        Do you want to sign out from your account?
      </Dialog>
    </>
  );
}

export default Navigation;
