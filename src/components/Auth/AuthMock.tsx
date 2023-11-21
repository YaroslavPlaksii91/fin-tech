import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import MockAdapter from 'axios-mock-adapter';
import { AxiosResponse } from 'axios';

import { mockUser } from '../../mockUser';

import { setUser } from '@store/user/user';
import Auth from '@utils/auth';
import Logger from '@utils/logger.ts';
import api from '@utils/api';
import { apiUrls } from '@constants/api-urls';

function AuthMock(props: GoogleAuthProps) {
  const { setIsError } = props;
  const dispatch = useDispatch();

  const login = async (token: string): Promise<void> => {
    try {
      // mock request
      const mock = new MockAdapter(api);
      mock.onPost(apiUrls.auth.login).reply(200, mockUser);

      const response: AxiosResponse<serverTokenResponse> = await api.post(
        apiUrls.auth.login,
        {
          access_token: token,
          code: 'code'
        }
      );
      const { data } = response;
      Auth.login(data.key);

      dispatch(setUser(data.user));
    } catch (e) {
      setIsError(true);
      Logger.error(e);
    }
  };

  // const fromPage: string = location?.state?.from?.pathname || '/';

  return (
    <Button onClick={() => void login(mockUser.key)} variant="contained">
      Log in
    </Button>
  );
}

export default AuthMock;
