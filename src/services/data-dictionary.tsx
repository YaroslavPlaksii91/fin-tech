import { api } from '@utils/api';
import {
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

  async validateExpression(data: ExpressionValidate) {
    const res = await api.post<ExpressionValidate>(
      '/expression-builder/validate',
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

  async getUserDefinedVariableUsage(flowId: string, variables: string[]) {
    const { data } = await api.post<VariableUsageParams>(
      `/flows/${flowId}/variables-usage`,
      variables
    );
    return data;
  }
}

export const dataDictionaryService = new DataDictionaryService();
