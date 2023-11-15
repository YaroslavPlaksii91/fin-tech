import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import Cookie from 'js-cookie';
import MockAdapter from 'axios-mock-adapter';

import { router } from './routes.tsx';
import { mockUser } from './mockUser.ts';

import { setUser } from '@store/user/user.ts';
import LoadingFullscreen from '@components/shared/LoadingFullscreen.tsx';
import { apiUrls } from '@constants/api-urls';
import api, { setAuthHeader } from '@utils/api';
import Logger from '@utils/logger.ts';
import { cookiesKeys } from '@constants/constants.ts';

export type voidFunc = () => void;

function App() {
  const [checkAuthSuccess, setCheckAuthSuccess] = useState(false);
  const dispatch = useDispatch();

  const getUser = async () => {
    try {
      const mock = new MockAdapter(api);
      mock.onGet(apiUrls.users.current).reply(200, mockUser);

      const response: AxiosResponse<serverTokenResponse> = await api.get(
        apiUrls.users.current
      );

      const { user } = response.data;

      dispatch(setUser(user));
    } catch (e) {
      Cookie.remove(cookiesKeys.authToken);
      Logger.error(e);
    } finally {
      setCheckAuthSuccess(true);
    }
  };

  const authCheck: voidFunc = () => {
    const token = Cookie.get(cookiesKeys.authToken);
    if (token) {
      setAuthHeader(token);

      void getUser();
    } else {
      setCheckAuthSuccess(true);
    }
  };

  if (!checkAuthSuccess) {
    authCheck();
  }

  return (
    <>
      {checkAuthSuccess ? (
        <RouterProvider router={router} />
      ) : (
        <LoadingFullscreen />
      )}
    </>
  );
}

export default App;
