import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

import { authService } from '@services/auth';
import routes from '@constants/routes';
import Loader from '@components/shared/Loader';

const AccessVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  const isLogout = searchParams.get('logout');

  // This is a temporary solution for redirecting back
  // to the previous page (after login or getting access token)
  // Necessary for the Reports System
  const backToPath = localStorage.getItem('back_to');

  useEffect(() => {
    if (isLogout) {
      return void authService.onTokenChange(null);
    }

    if (code) {
      return void authService.getAccessToken(code);
    }

    if (authService.isTokenSet()) {
      navigate(backToPath || routes.index);
    } else {
      navigate(routes.auth.login);
    }
  }, []);

  return (
    <Stack alignItems="center" justifyContent="center" height="100vh">
      <Loader />
      {!isLogout && (
        <>
          <Typography variant="h3">Access verification</Typography>
          <Typography variant="body2">
            Please, wait a moment while we verify your access...
          </Typography>
        </>
      )}
    </Stack>
  );
};

export default AccessVerification;
