import { useEffect } from 'react';

import { authService } from '@services/auth.ts';

function Login() {
  useEffect(() => {
    authService.redirectToAuthorize();
  }, []);

  return <div>Loading...</div>;
}

export default Login;
