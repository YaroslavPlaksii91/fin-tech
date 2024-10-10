import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Stack, Typography } from '@mui/material';

import { authService } from '@services/auth';
import routes from '@constants/routes';
import Loader from '@components/shared/Loader';

const AccessVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  const isLogout = searchParams.get('logout');

  useEffect(() => {
    if (isLogout) {
      authService.onTokenChange(null);
    } else {
      if (authService.isTokenSet()) {
        navigate(routes.index);
      }
      if (code) {
        void authService.getAccessToken(code);
      } else {
        void navigate(routes.auth.login);
      }
    }
  }, [code, navigate]);

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

export default AccessVerificationPage;
