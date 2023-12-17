import { AxiosResponse } from 'axios';

import api from '@utils/api';
import { IFlowData, IFlowListItem } from '@domain/flow';

class FlowService {
  async getFlows(): Promise<AxiosResponse<IFlowListItem[]>> {
    return await api.get('/flows');
  }

  async createFlow(data: IFlowData): Promise<IFlowData> {
    return await api.post('/flows', data);
  }

  async getFlow(id: string) {
    const response = await api.get<IFlowData>(`/flows/${id}`);
    return response.data;
  }

  async updateFlow(id: string): Promise<IFlowData> {
    return await api.put(`/flows/${id}`);
  }

  async deleteFlow(id: string): Promise<void> {
    return await api.delete(`/flows/${id}`);
  }
}

export const flowService = new FlowService();
