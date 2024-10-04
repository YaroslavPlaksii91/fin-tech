import { JSONPatchOperation } from '@domain/entity';
import { IFlow } from '@domain/flow';
import { flowService } from '@services/flow-service';
import { createAppAsyncThunk } from '@store/utils';

export const getFlow = createAppAsyncThunk(
  'flow/getFlow',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await flowService.getFlow(id);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getProductionFlow = createAppAsyncThunk(
  'flow/getProductionFlowDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await flowService.getProductionFlowDetails();
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const saveFlow = createAppAsyncThunk(
  'flow/save',
  async (data: IFlow, { rejectWithValue }) => {
    try {
      const response = await flowService.saveFlow(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateFlow = createAppAsyncThunk(
  'flow/update',
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
