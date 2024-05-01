import { configureStore } from '@reduxjs/toolkit';

import flowList from './flowList/flowList';
import flow from './flow/flow';

import { authReducer } from '@store/auth/auth.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flow,
    flowList
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
