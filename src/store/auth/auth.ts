import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserInfoModel } from '@eloanwarehouse/frontend-core';

import { authService } from '@services/auth.ts';
import Logger from '@utils/logger.ts';

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

const initialState: { user: null | UserInfoModel } = {
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  selectors: {
    selectUserInfo: (state) => state.user
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, { payload }) => {
      state.user = payload as UserInfoModel;
    });
  }
});

export const { selectUserInfo } = authSlice.selectors;

export const authReducer = authSlice.reducer;
