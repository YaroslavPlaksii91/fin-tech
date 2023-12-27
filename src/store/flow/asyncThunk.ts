import { createAsyncThunk } from '@reduxjs/toolkit';

import { flowService } from '@services/flow-service';

export const fetchFlow = createAsyncThunk(
  'get/flows/id',
  async (id: string) => await flowService.getFlow(id)
);

export const fetchProductionFlow = createAsyncThunk(
  'get/production-flow/details',
  async () => await flowService.getProductionFlowDetails()
);
