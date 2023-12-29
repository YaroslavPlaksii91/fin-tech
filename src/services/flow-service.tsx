import api from '@utils/api';
import { FlowData, IFlow, IFlowDataCreate, IFlowListItem } from '@domain/flow';
import { JSONPatchOperation } from '@domain/entity';

class FlowService {
  async getFlows() {
    const { data } = await api.get<IFlowListItem[]>('/flows');
    return data;
  }

  async createFlow(createData: IFlowDataCreate) {
    const { data } = await api.post<IFlow>('/flows', createData);
    return data;
  }

  async updateFullFlow(data: IFlow): Promise<IFlow> {
    return await api.put(`/flows/${data.id}`, data);
  }

  async getFlow(id: string) {
    const { data } = await api.get<IFlow>(`/flows/${id}`);
    return data;
  }

  async updateFlow(id: string, operations: JSONPatchOperation[]) {
    const { data } = await api.patch<IFlow>(`/flows/${id}`, operations, {
      headers: {
        'Content-Type': 'application/json-patch+json'
      }
    });
    return data;
  }

  async deleteFlow(id: string) {
    const { data } = await api.delete<IFlow>(`/flows/${id}`);
    return data;
  }

  async getProductionFlow() {
    const { data } = await api.get<FlowData>('/production-flow');
    return data;
  }

  async getProductionFlowDetails() {
    const { data } = await api.get<IFlow>('/production-flow/details');
    return data;
  }
}

export const flowService = new FlowService();
