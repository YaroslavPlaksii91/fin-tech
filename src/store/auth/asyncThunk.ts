import { createAsyncThunk } from '@reduxjs/toolkit';

import { authService } from '@services/auth';
import Logger from '@utils/logger';

export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async () => {
    try {
      const response = await authService.fetchUserInfo();
      return response.data;
    } catch (e) {
      Logger.error(e);
    }
  }
);
