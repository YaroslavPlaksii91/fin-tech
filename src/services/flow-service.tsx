import api from '@utils/api';
import {
  FlowData,
  IFlowData,
  IFlowDataCreate,
  IFlowListItem
} from '@domain/flow';
import { JSONPatchOperation } from '@domain/entity';

class FlowService {
  async getFlows() {
    const { data } = await api.get<IFlowListItem[]>('/flows');
    return data;
  }

  async createFlow(data: IFlowDataCreate): Promise<IFlowData> {
    return await api.post('/flows', data);
  }

  async getFlow(id: string) {
    const { data } = await api.get<IFlowData>(`/flows/${id}`);
    return data;
  }

  async updateFlow(id: string, operations: JSONPatchOperation[]) {
    const { data } = await api.patch<IFlowData>(`/flows/${id}`, operations, {
      headers: {
        'Content-Type': 'application/json-patch+json'
      }
    });
    return data;
  }

  async deleteFlow(id: string) {
    return await api.delete(`/flows/${id}`);
  }

  async getProductionFlow() {
    const { data } = await api.get<FlowData>('/production-flow');
    return data;
  }

  async getProductionFlowDetails() {
    const { data } = await api.get<IFlowData>('/production-flow/details');
    return data;
  }
}

export const flowService = new FlowService();
