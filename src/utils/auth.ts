import Cookie from 'js-cookie';

import { cookiesKeys } from '@constants/constants';

class Auth {
  static login(username: string, password: string) {
    const combinedCredentials = encodeURIComponent(`${username}:${password}`);
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    Cookie.set(cookiesKeys.credentials, combinedCredentials, {
      secure: true,
      expires: tomorrow
    });
  }
}

export default Auth;
