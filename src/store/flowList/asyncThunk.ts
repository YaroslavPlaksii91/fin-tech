import { createAsyncThunk } from '@reduxjs/toolkit';

import { flowService } from '@services/flow-service';
import { JSONPatchOperation } from '@domain/entity';
import { IFlow, IFlowDataCreate } from '@domain/flow';

export const fetchFlowList = createAsyncThunk('get/flow-list', async () => {
  const flowItemsData = await flowService.getFlows();
  const productionFlowItemData = await flowService.getProductionFlow();
  return { flowItemsData, productionFlowItemData };
});

export const renameFlow = createAsyncThunk(
  'patch/rename-flow',
  async (
    {
      id,
      operations
    }: {
      id: string;
      operations: JSONPatchOperation[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await flowService.updateFlow(id, operations);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteFlow = createAsyncThunk(
  'delete/flow',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await flowService.deleteFlow(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createFlow = createAsyncThunk(
  'create/flow',
  async (data: IFlowDataCreate, { rejectWithValue }) => {
    try {
      const response = await flowService.createFlow(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const pushProductionFlow = createAsyncThunk(
  'push/flow',
  async (
    data: { flow: IFlow; params: { pushedBy: string; note: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await flowService.pushProductionFlow(
        data.flow,
        data.params
      );
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
