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

export const createFlow = createAsyncThunk(
  'create/flow',
  async (data: IFlowDataCreate) => await flowService.createFlow(data)
);

export const pushProductionFlow = createAsyncThunk(
  'push/flow',
  async (data: IFlow) => await flowService.pushProductionFlow(data)
);
