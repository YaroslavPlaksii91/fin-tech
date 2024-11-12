import { Auth } from '@eloanwarehouse/frontend-core';

import { router } from '../routes';

import { CLIENT_ID, SCOPES_LIST } from '@constants/common';
import { api, integrationApi, reportApi } from '@utils/api';
import { authApiBaseUrl } from '@constants/api-urls';
import routes from '@constants/routes';

export const authService = new Auth.IAMAuthService({
  clientId: CLIENT_ID,
  scopes: [
    // TODO: delete unnecessary scopes
    SCOPES_LIST.OFFLINE_ACCESS,
    SCOPES_LIST.OPEN_ID,
    SCOPES_LIST.PROFILE,
    SCOPES_LIST.POLICIES
  ],
  apiUrl: authApiBaseUrl,
  callbackUrl: window.location.origin + routes.auth.accessVerification,
  onTokenChange(token: string | null) {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      reportApi.defaults.headers.Authorization = `Bearer ${token}`;
      integrationApi.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
      delete reportApi.defaults.headers.Authorization;
      delete integrationApi.defaults.headers.Authorization;
    }
  },
  onLogin() {
    // This is a temporary solution for redirecting back
    // to the previous page (after login or getting access token)
    // Necessary for the Reports System
    const backToPath = localStorage.getItem('back_to');
    void router.navigate(backToPath || routes.index);
  },
  onLogout() {
    authService.redirectToAuthorize();
  },
  onError() {
    authService.logout();
  }
});
