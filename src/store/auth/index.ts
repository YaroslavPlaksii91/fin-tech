import { createSlice } from '@reduxjs/toolkit';
import { UserInfoModel } from '@eloanwarehouse/frontend-core';

import { fetchUserInfo } from './asyncThunk';

const initialState: { user: null | UserInfoModel } = { user: null };

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

export default authSlice.reducer;
