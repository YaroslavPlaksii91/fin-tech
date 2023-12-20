import Cookie from 'js-cookie';

import { cookiesKeys } from '@constants/common';

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

  static getUsername() {
    const credentialsCookie = Cookie.get(cookiesKeys.credentials);
    if (credentialsCookie) {
      const decodedCredentials = decodeURIComponent(credentialsCookie);
      const [storedUsername] = decodedCredentials.split(':');
      return storedUsername;
    }
    return '';
  }
}

export default Auth;
