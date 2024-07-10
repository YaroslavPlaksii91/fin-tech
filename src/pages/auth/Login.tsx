import { useEffect } from 'react';

import { authService } from '@services/auth.ts';
import LoadingFullscreen from '@components/shared/LoadingFullscreen';

function Login() {
  useEffect(() => {
    authService.redirectToAuthorize();
  }, []);

  return <LoadingFullscreen />;
}

export default Login;
