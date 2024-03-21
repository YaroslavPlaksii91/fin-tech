import api from '@utils/api';
import {
  DataDictionaryVariable,
  ExpressionValidate,
  VariableUsageParams
} from '@domain/dataDictionary';
import { userDefinedData } from '@constants/mocks';

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

  getUserDefinedVariables() {
    return new Promise((resolve) => {
      resolve(userDefinedData);
    });
  }

  async getVariableUsage(flowId: string, variableName: string) {
    const { data } = await api.get<VariableUsageParams>(
      `/flows/${flowId}/variable-usage/${variableName}`
    );
    return data;
  }
}

export const dataDictionaryService = new DataDictionaryService();
