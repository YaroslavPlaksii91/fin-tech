import { RootState } from '@store/store';

export const selectFlow = (state: RootState) => state.flow;

export const selectFlowData = (state: RootState) => state.flow.flow.data;
