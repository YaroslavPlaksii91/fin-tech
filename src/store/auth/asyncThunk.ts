import { authService } from '@services/auth';
import { createAppAsyncThunk } from '@store/utils';
import Logger from '@utils/logger';

export const fetchUserInfo = createAppAsyncThunk(
  'auth/fetchUserInfo',
  async () => {
    try {
      const response = await authService.fetchUserInfo();
      return response?.data;
    } catch (e) {
      Logger.error(e);
    }
  }
);
