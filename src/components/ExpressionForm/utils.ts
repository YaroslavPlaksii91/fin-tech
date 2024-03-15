import { AxiosError } from 'axios';

import {
  DATA_TYPE,
  DataDictionaryVariable,
  UserDefinedVariable,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';

// Add correct type for params and variableSources
interface MappingResult {
  params: { name: string; dataType: DATA_TYPE }[];
  variableSources: { name: string; sourceType: VARIABLE_SOURCE_TYPE }[];
}

export const mapVariablesToParamsAndSources = (
  variables: (DataDictionaryVariable | UserDefinedVariable)[]
) =>
  variables.reduce<MappingResult>(
    (acc, variable) => {
      acc.params.push({
        name: variable.name,
        dataType: variable.dataType
      });

      acc.variableSources.push({
        name: variable.name,
        sourceType: variable.sourceType
      });

      return acc;
    },
    { params: [], variableSources: [] }
  );

type Error = { message: string; position: number };

export const parseError = (error: AxiosError): Error | undefined => {
  if (
    error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data
  ) {
    return error.response.data as Error;
  }
};
