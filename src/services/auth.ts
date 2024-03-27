import { Auth } from '@eloanwarehouse/frontend-core';

import { CLIENT_ID, SCOPES_LIST } from '@constants/common.ts';
import api from '@utils/api.ts';
import { apiUrls, authApiBaseUrl } from '@constants/api-urls.ts';
import routes from '@constants/routes.ts';

export const authService = new Auth.IAMAuthService({
  clientId: CLIENT_ID,
  scopes: [SCOPES_LIST.OFFLINE_ACCESS, SCOPES_LIST.ROLES],
  apiUrls: {
    authorize: authApiBaseUrl + apiUrls.auth.authorize,
    token: authApiBaseUrl + apiUrls.auth.token,
    logout: authApiBaseUrl + apiUrls.auth.logout
  },
  callbackUrl: window.location.origin + routes.auth.accessVerification,
  onTokenChange(token: string | null) {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  }
});
