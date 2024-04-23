import { createAsyncThunk } from '@reduxjs/toolkit';

import { IFlow } from '@domain/flow';
import { flowService } from '@services/flow-service';

export const getFlow = createAsyncThunk(
  'get/flow',
  async (id: string) => await flowService.getFlow(id)
);

export const getProductionFlow = createAsyncThunk(
  'get/production-flow/details',
  async () => await flowService.getProductionFlowDetails()
);

export const saveFlow = createAsyncThunk(
  'put/flow',
  async (updateData: IFlow) => await flowService.saveFlow(updateData)
);
