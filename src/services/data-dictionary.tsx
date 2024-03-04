import api from '@utils/api';
import { DataDictionaryVariable } from '@domain/dataDictionary';
import { userDefinedData } from '@constants/mocks';

class DataDictionaryService {
  async getDataDictionaryVariables() {
    const { data } = await api.get<Record<string, DataDictionaryVariable[]>>(
      '/expression-builder/data-dictionary-variables'
    );
    return data;
  }

  getUserDefinedVariables() {
    return new Promise((resolve) => {
      resolve(userDefinedData);
    });
  }
}

export const dataDictionaryService = new DataDictionaryService();
