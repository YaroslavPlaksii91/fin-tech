import { createSlice } from '@reduxjs/toolkit';

import { fetchFlowList, renameFlow, deleteFlow } from './asyncThunk';

import { IFlowListItem } from '@domain/flow';

interface initialStateInterface {
  flowList: IFlowListItem[];
  flowProduction: IFlowListItem | Record<string, never>;
}

const initialState: initialStateInterface = {
  flowList: [],
  flowProduction: {}
};

export const flowListSlicer = createSlice({
  name: 'flowList',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchFlowList.fulfilled, (state, action) => {
      state.flowList = action.payload.flowItemsData;
      state.flowProduction = action.payload.productionFlowItemData;
    });
    builder.addCase(renameFlow.fulfilled, (state, action) => {
      const { id, data } = action.payload;
      const updatedIndex = state.flowList.findIndex((item) => item.id === id);

      if (updatedIndex !== -1) {
        state.flowList[updatedIndex] = {
          ...state.flowList[updatedIndex],
          ...data
        };
      }
    });
    builder.addCase(deleteFlow.fulfilled, (state, action) => {
      const { id } = action.payload;
      state.flowList = state.flowList.filter((item) => item.id !== id);
    });
  }
});

export default flowListSlicer.reducer;