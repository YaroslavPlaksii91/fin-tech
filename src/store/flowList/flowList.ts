import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { IFlowListItem } from '@domain/flow';
import { flowService } from '@services/flow-service';
import { JSONPatchOperation } from '@domain/entity';

export const fetchFlowList = createAsyncThunk('get/flowList', async () => {
  const flowItemsData = await flowService.getFlows();
  const productionFlowItemData = await flowService.getProductionFlow();
  return { flowItemsData, productionFlowItemData };
});

export const renameFlow = createAsyncThunk(
  'patch/rename-flow-item',
  async ({
    id,
    operations
  }: {
    id: string;
    operations: JSONPatchOperation[];
  }) => {
    const data = await flowService.updateFlow(id, operations);
    return data;
  }
);

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
  }
});

export default flowListSlicer.reducer;
