import api from '@utils/api';
import { DataDictionaryVariable } from '@domain/dataDictionary';
import { userDefinedData } from '@constants/mocks';

export const getDataDictionaryVariables = async () => {
  const { data } = await api.get<DataDictionaryVariable[]>(
    '/expression-builder/data-dictionary-variables'
  );
  return data;
};

export const getUserDefinedVariables = () =>
  new Promise((resolve) => {
    resolve(userDefinedData);
  });
