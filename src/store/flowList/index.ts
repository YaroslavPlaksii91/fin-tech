import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  fetchDraftFlowList,
  fetchProductionFlowItem,
  renameFlow,
  deleteFlow,
  createFlow,
  pushProductionFlow
} from './asyncThunk';

import { IFlowListItem } from '@domain/flow';

interface initialStateInterface {
  flowList: IFlowListItem[];
  flowProduction: IFlowListItem | null;
}

const initialState: initialStateInterface = {
  flowList: [],
  flowProduction: null
};

export const flowListSlicer = createSlice({
  name: 'flowList',
  initialState,
  reducers: {
    updateFlowListItem(state, action: PayloadAction<IFlowListItem>) {
      const flowListItem = state.flowList.find(
        (item) => item.id === action.payload.id
      );
      if (flowListItem) {
        flowListItem.editedBy = action.payload.editedBy;
        flowListItem.editedOn = action.payload.editedOn;
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(fetchDraftFlowList.fulfilled, (state, action) => {
      state.flowList = action.payload.flowItemsData;
    });
    builder.addCase(fetchProductionFlowItem.fulfilled, (state, action) => {
      state.flowProduction = action.payload.productionFlowItemData;
    });
    builder.addCase(fetchDraftFlowList.rejected, (state) => {
      state.flowList = [];
    });
    builder.addCase(fetchProductionFlowItem.rejected, (state) => {
      state.flowProduction = null;
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
    builder.addCase(createFlow.fulfilled, (state, action) => {
      const flowItem = { ...action.payload.data, id: action.payload.id };
      state.flowList.unshift(flowItem);
    });
    builder.addCase(pushProductionFlow.fulfilled, (state, action) => {
      const flowItem = { ...action.payload.data, id: action.payload.id };
      state.flowProduction = flowItem;
    });
  }
});

export default flowListSlicer.reducer;

export const { updateFlowListItem } = flowListSlicer.actions;
