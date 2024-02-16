import { createAsyncThunk } from '@reduxjs/toolkit';

import { flowService } from '@services/flow-service';
import { JSONPatchOperation } from '@domain/entity';
import { IFlowDataCreate } from '@domain/flow';

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
  }) => await flowService.updateFlow(id, operations)
);

export const deleteFlow = createAsyncThunk(
  'delete/flow',
  async (id: string) => await flowService.deleteFlow(id)
);

export const duplicateFlow = createAsyncThunk(
  'create/flow',
  async (flow: IFlowDataCreate) => await flowService.createFlow(flow)
);
