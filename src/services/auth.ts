import qs from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import Cookie from 'js-cookie';
import { AxiosError } from 'axios';

import { router } from '../routes.tsx';

import {
  CLIENT_ID,
  GRANT_TYPES,
  IAM_SERVICE_URL,
  SCOPES_LIST
} from '@constants/common.ts';
import routes from '@constants/routes.ts';
import { apiUrls, authApiBaseUrl } from '@constants/api-urls.ts';
import api from '@utils/api.ts';

interface ITokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserInfoModel {
  email: string;
  firstName: string;
  lastName: string;
  policies: string[];
  roles: string[];
  userId: string;
  userName: string;
}

// @TODO: Separate package with config argument
class AuthService {
  readonly accessTokenCookiesKey: string = 'access_token';
  readonly refreshTokenCookiesKey: string = 'refresh_token';

  clientId: string;
  scopes: string[];
  onTokenChange: (token: string | null) => void;

  constructor({
    clientId,
    scopes,
    onTokenChange
  }: {
    clientId: string;
    scopes: string[];
    onTokenChange: (token: string | null) => void;
  }) {
    this.clientId = clientId;
    this.scopes = scopes;
    this.onTokenChange = onTokenChange;
  }

  isTokenSet(): boolean {
    return Boolean(Cookie.get(this.refreshTokenCookiesKey));
  }

  getToken(): string | undefined {
    return Cookie.get(this.accessTokenCookiesKey);
  }

  getRefreshToken(): string | undefined {
    return Cookie.get(this.refreshTokenCookiesKey);
  }

  setAuthCookies(
    accessToken: string,
    refreshToken: string,
    expires_in: number
  ): void {
    const expireDate = new Date(new Date().getTime() + expires_in * 1000);

    Cookie.set(this.accessTokenCookiesKey, accessToken, {
      expires: expireDate
    });
    Cookie.set(this.refreshTokenCookiesKey, refreshToken);
  }

  removeAuthCookies(): void {
    Cookie.remove(this.accessTokenCookiesKey);
    Cookie.remove(this.refreshTokenCookiesKey);
  }

  redirectToAuthorize(): void {
    const payload = qs.stringify({
      client_id: this.clientId,
      redirect_uri: window.location.origin + routes.auth.accessVerification,
      scope: this.scopes.join(' '),
      response_type: 'code',
      state: uuidv4()
    });

    window.open(
      IAM_SERVICE_URL + apiUrls.auth.authorize + '?' + payload,
      '_self'
    );
  }

  async getAccessToken(code: string) {
    try {
      const response = await api.post<ITokenResponse>(
        authApiBaseUrl + apiUrls.auth.token,
        {
          grant_type: GRANT_TYPES.AUTH_CODE,
          client_id: this.clientId,
          redirect_uri: window.location.origin + routes.auth.accessVerification,
          code
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          getRedirectURL: true
        }
      );

      const { access_token, refresh_token, expires_in } =
        response.data as ITokenResponse;

      this.onTokenChange(access_token);
      this.setAuthCookies(access_token, refresh_token, expires_in);
      void router.navigate(routes.index);
    } catch (err) {
      // @TODO: Handle error
    }
  }

  logout() {
    void api.get(authApiBaseUrl + apiUrls.auth.logout).finally(() => {
      setTimeout(() => {
        this.onTokenChange(null);
        this.removeAuthCookies();
        void router.navigate(routes.index);
      });
    });
  }

  async refreshToken() {
    try {
      const response = await api.post<ITokenResponse>(
        authApiBaseUrl + apiUrls.auth.token,
        {
          refresh_token: this.getRefreshToken(),
          grant_type: GRANT_TYPES.REFRESH_TOKEN,
          client_id: this.clientId
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          refreshToken: true
        }
      );

      const { access_token, refresh_token, expires_in } =
        response.data as ITokenResponse;

      this.onTokenChange(access_token);
      this.setAuthCookies(access_token, refresh_token, expires_in);
      this.removeAuthCookies();
      this.logout();
    } catch (err) {
      this.removeAuthCookies();
      this.logout();
    }
  }

  async axiosRequestMiddleware() {
    if (!this.getToken() && this.getRefreshToken()) {
      await this.refreshToken();
    }
  }

  axiosResponseMiddleware(error: AxiosError) {
    if (error.response?.status === 401) {
      this.logout();
    }
  }
}

export const authService = new AuthService({
  clientId: CLIENT_ID,
  scopes: [SCOPES_LIST.OFFLINE_ACCESS, SCOPES_LIST.ROLES],
  onTokenChange(token: string | null) {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  }
});
