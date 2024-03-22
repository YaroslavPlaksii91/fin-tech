import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import api from '@utils/api.ts';
import { apiUrls, authApiBaseUrl } from '@constants/api-urls.ts';
import { UserInfoModel } from '@services/auth.ts';

export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async () => {
    const response = await api.get(authApiBaseUrl + apiUrls.currentUser);
    return response.data as UserInfoModel;
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
      state.user = payload;
    });
  }
});

export const { selectUserInfo } = authSlice.selectors;

export const authReducer = authSlice.reducer;
