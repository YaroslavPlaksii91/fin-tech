import { createAsyncThunk } from '@reduxjs/toolkit';

import { IFlow } from '@domain/flow';
import { flowService } from '@services/flow-service';

export const getFlow = createAsyncThunk(
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

export const getProductionFlow = createAsyncThunk(
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

export const saveFlow = createAsyncThunk(
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
