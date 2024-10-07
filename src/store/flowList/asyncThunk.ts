import { flowService } from '@services/flow-service';
import { JSONPatchOperation } from '@domain/entity';
import { IFlow, IFlowDataCreate } from '@domain/flow';
import { createAppAsyncThunk } from '@store/utils';

export const fetchDraftFlowList = createAppAsyncThunk(
  'flowList/fetchDraftFlowList',
  async () => {
    const flowItemsData = await flowService.getFlows();
    return { flowItemsData };
  }
);

export const fetchProductionFlowItem = createAppAsyncThunk(
  'flowList/fetchProductionFlowItem',
  async () => {
    const productionFlowItemData = await flowService.getProductionFlow();
    return { productionFlowItemData };
  }
);

export const renameFlow = createAppAsyncThunk(
  'flowList/renameFlow',
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

export const deleteFlow = createAppAsyncThunk(
  'flowList/deleteFlow',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await flowService.deleteFlow(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createFlow = createAppAsyncThunk(
  'flowList/createFlow',
  async (data: IFlowDataCreate, { rejectWithValue }) => {
    try {
      const response = await flowService.createFlow(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const pushProductionFlow = createAppAsyncThunk(
  'flowList/pushProductionFlow',
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
