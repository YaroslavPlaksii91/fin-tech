import { useEffect } from 'react';

import { authService } from '@services/auth';
import LoadingFullscreen from '@components/shared/LoadingFullscreen';

const Login = () => {
  useEffect(() => {
    authService.redirectToAuthorize();
  }, []);

  return <LoadingFullscreen />;
};

export default Login;
