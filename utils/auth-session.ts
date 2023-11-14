import axios, { AxiosStatic } from 'axios';
import Router from 'next/router';
import { NextPageContext } from 'next';

import Cookies from '@utils/cookies';
import { userTokenCookiesKey } from '@constants/constants';
import routes from '@constants/routes';

class AuthSession {
  static axiosInstance: AxiosStatic = axios;
  static tokenKey: string = userTokenCookiesKey;

  static getTokenValue = (ctx: NextPageContext) =>
    Cookies.get(AuthSession.tokenKey, ctx);

  static isTokenSet(ctx: NextPageContext) {
    const authToken = AuthSession.getTokenValue(ctx);
    return authToken && !!authToken.trim();
  }

  static setHeader(ctx?: NextPageContext) {
    if (ctx && AuthSession.isTokenSet(ctx)) {
      const authToken = AuthSession.getTokenValue(ctx);
      AuthSession.axiosInstance.defaults.headers.Authorization = `Token ${authToken}`;
    } else {
      AuthSession.removeHeader();
    }
  }

  static removeHeader() {
    AuthSession.axiosInstance.defaults.headers.Authorization = '';
  }

  static set(tokenValue: string) {
    Cookies.set(AuthSession.tokenKey, tokenValue);
    AuthSession.setHeader();
  }

  static remove(ctx: NextPageContext) {
    Cookies.remove(AuthSession.tokenKey, ctx);
    AuthSession.removeHeader();
  }

  static login(token: string) {
    AuthSession.set(token);
    Router.push(routes.index);
  }
}

export default AuthSession;
