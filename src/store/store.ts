import { configureStore } from '@reduxjs/toolkit';

import flowList from './flowList/flowList';

export const store = configureStore({
  reducer: {
    flowList
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
