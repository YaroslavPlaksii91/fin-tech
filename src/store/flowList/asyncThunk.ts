import { createAsyncThunk } from '@reduxjs/toolkit';

import { flowService } from '@services/flow-service';
import { JSONPatchOperation } from '@domain/entity';

export const fetchFlowList = createAsyncThunk('get/flow-list', async () => {
  const flowItemsData = await flowService.getFlows();
  const productionFlowItemData = await flowService.getProductionFlow();
  return { flowItemsData, productionFlowItemData };
});

export const renameFlow = createAsyncThunk(
  'patch/rename-flow',
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

export const deleteFlow = createAsyncThunk(
  'delete/flow',
  async (id: string) => {
    const data = await flowService.deleteFlow(id);
    return data;
  }
);
