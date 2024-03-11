import api from '@utils/api';
import {
  DataDictionaryVariable,
  ExpressionValidate
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
}

export const dataDictionaryService = new DataDictionaryService();
