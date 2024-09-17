import { api, integrationApi } from '@utils/api';
import {
  ConditionValidate,
  DataDictionaryIntegrationVariable,
  DataDictionaryVariable,
  ExpressionValidate,
  VariableUsageParams
} from '@domain/dataDictionary';

class DataDictionaryService {
  async getDataDictionaryVariables() {
    const { data } = await api.get<Record<string, DataDictionaryVariable[]>>(
      '/expression-builder/data-dictionary-variables'
    );
    return data;
  }

  async getIntegrationVariables() {
    const { data } =
      await integrationApi.get<
        Record<string, DataDictionaryIntegrationVariable[]>
      >('/data-dictionary');
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

  async getVariableUsage(flowId: string, variableName: string) {
    const { data } = await api.get<VariableUsageParams>(
      `/flows/${flowId}/variable-usage/${variableName}`
    );
    return data;
  }

  async getProductionVariableUsage(variableName: string) {
    const { data } = await api.get<VariableUsageParams>(
      `/production-flow/variable-usage/${variableName}`
    );
    return data;
  }

  async getUserDefinedVariableUsage(flowId: string, variables: string[]) {
    const { data } = await api.post<VariableUsageParams>(
      `/flows/${flowId}/variables-usage`,
      variables
    );
    return data;
  }

  async getProductionUserDefinedVariableUsage(variables: string[]) {
    const { data } = await api.post<VariableUsageParams>(
      `/production-flow/variables-usage`,
      variables
    );
    return data;
  }
}

export const dataDictionaryService = new DataDictionaryService();
