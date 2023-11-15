import Cookie from 'js-cookie';

import { setAuthHeader } from '@utils/api';
import { cookiesKeys } from '@constants/constants';

class Auth {
  static login(token: string) {
    setAuthHeader(token);
    Cookie.set(cookiesKeys.authToken, token);
  }
}

export default Auth;
