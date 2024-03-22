import { configureStore } from '@reduxjs/toolkit';

import flowList from './flowList/flowList';

import { authReducer } from '@store/auth/auth.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flowList
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
