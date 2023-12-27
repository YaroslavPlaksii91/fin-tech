import { configureStore } from '@reduxjs/toolkit';

import flowList from './flowList/flowList';
import flow from './flow/flow';

export const store = configureStore({
  reducer: {
    flowList,
    flow
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
