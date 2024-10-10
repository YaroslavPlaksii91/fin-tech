import { createSelector } from '@reduxjs/toolkit';

import { getExtendedUserDefinedVariables } from './utils';

import { RootState } from '@store/store';

export const selectFlow = (state: RootState) => state.flow;

export const selectFlowData = (state: RootState) => state.flow.flow.data;

export const selectUserDefinedVariables = createSelector(
  [(state: RootState) => state.flow.flow],
  (flow) => getExtendedUserDefinedVariables(flow)
);
