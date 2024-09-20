import { api } from '@utils/api';
import { FlowData, IFlow, IFlowDataCreate, IFlowListItem } from '@domain/flow';
import { JSONPatchOperation } from '@domain/entity';
import { ChangeHistoryRecord } from '@domain/changeHistory';
import { ConditionValidate, ExpressionValidate } from '@domain/dataDictionary';

class FlowService {
  async getFlows() {
    const { data } = await api.get<IFlowListItem[]>('/flows');
    return data;
  }

  async createFlow(createData: IFlowDataCreate) {
    const { data } = await api.post<IFlow>('/flows', createData);
    return data;
  }

  async saveFlow(updateData: IFlow) {
    const { data } = await api.put<IFlow>(
      `/flows/${updateData.id}`,
      updateData
    );
    return data;
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

  async pushProductionFlow(
    flow: IFlow,
    params: { pushedBy: string; note: string }
  ) {
    const { data } = await api.post<IFlow>(`/production-flow`, flow, {
      params
    });
    return data;
  }

  async getProductionFlowDetails() {
    const { data } = await api.get<IFlow>('/production-flow/details');
    return data;
  }

  async validateFlow(flow: IFlow) {
    const res = await api.post(
      '/flows/validate-is-directed-acyclic-graph',
      flow
    );
    return res;
  }

  async getChangeHistoryList(pageNumber: number = 1, pageSize: number = 10) {
    const { data } = await api.get<ChangeHistoryRecord[]>('/change-history', {
      params: {
        pageNumber,
        pageSize
      }
    });
    return data;
  }

  async validateExpression(data: ExpressionValidate) {
    const res = await api.post<ExpressionValidate>(
      '/expression-builder/validate',
      data
    );
    return res;
  }

  async validateCondition(data: ConditionValidate) {
    const res = await api.post<ConditionValidate>(
      '/expression-builder/validate-condition',
      data
    );
    return res;
  }
}

export const flowService = new FlowService();
