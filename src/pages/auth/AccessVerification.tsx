import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

import { authService } from '@services/auth.ts';
import Logger from '@utils/logger.ts';
import routes from '@constants/routes.ts';

const AccessVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');

  useEffect(() => {
    if (authService.isTokenSet()) {
      navigate(routes.index);
    } else {
      if (code) {
        void authService.getAccessToken(code, () => {
          navigate(routes.index);
        });
      } else {
        Logger.error('Auth error - code is missing');
      }
    }
  }, [code, navigate]);

  return <div>Please, wait a moment while we verify your access...</div>;
};

export default AccessVerificationPage;
