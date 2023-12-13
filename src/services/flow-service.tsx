import { AxiosResponse } from 'axios';

import { IFlowListItem } from '../types/domain';
import api from '../utils/api';

class FlowService {
  async getFlows(): Promise<AxiosResponse<IFlowListItem[]>> {
    return await api.get('/flows');
  }
}

export const flowService = new FlowService();
