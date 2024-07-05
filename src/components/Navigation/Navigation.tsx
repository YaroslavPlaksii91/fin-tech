import { Stack } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

import { StyledAppBar, StyledHeaderButton } from './styled';

import LogoutIcon from '@icons/log-out.svg';
import LogoIcon from '@icons/eloanLogo.svg';
import { authService } from '@services/auth.ts';
import { palette } from '@theme';
import routes from '@constants/routes';
import Dialog from '@components/shared/Modals/Dialog';

function Navigation() {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <StyledAppBar>
        <Stack justifyContent="space-between" height="100%" flexDirection="row">
          <Link
            component={RouterLink}
            to={routes.index}
            sx={{ display: 'flex' }}
          >
            <LogoIcon height={40} color={palette.white} />
          </Link>
          <StyledHeaderButton onClick={() => setOpenModal(true)}>
            <LogoutIcon color={palette.white} />
          </StyledHeaderButton>
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
