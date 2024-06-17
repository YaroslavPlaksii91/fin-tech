import { Auth } from '@eloanwarehouse/frontend-core';

import { router } from '../routes.tsx';

import { CLIENT_ID, SCOPES_LIST } from '@constants/common.tsx';
import { api } from '@utils/api.ts';
import { authApiBaseUrl } from '@constants/api-urls.ts';
import routes from '@constants/routes.ts';

export const authService = new Auth.IAMAuthService({
  clientId: CLIENT_ID,
  scopes: [SCOPES_LIST.OFFLINE_ACCESS, SCOPES_LIST.ROLES],
  apiUrl: authApiBaseUrl,
  callbackUrl: window.location.origin + routes.auth.accessVerification,
  onTokenChange(token: string | null) {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  },
  onLogin() {
    void router.navigate(routes.index);
  },
  onLogout() {
    void router.navigate(routes.auth.login);
  }
});
