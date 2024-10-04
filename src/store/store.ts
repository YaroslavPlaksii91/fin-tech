import { configureStore } from '@reduxjs/toolkit';

import auth from './auth';
import flowList from './flowList';
import flow from './flow';
import dataDictionary from './dataDictionary';

export const store = configureStore({
  reducer: {
    auth,
    flow,
    flowList,
    dataDictionary
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
