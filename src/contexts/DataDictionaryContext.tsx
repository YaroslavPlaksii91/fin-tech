import { createContext } from 'react';

import { Variable } from '@domain/dataDictionary';

export type DataDictionaryVariables = Record<string, Variable[]>;

export type DataDictionaryContextType = {
  variables?: DataDictionaryVariables;
  integrationVariables: DataDictionaryVariables;
  enumsDataTypes: string[];
};

export const DataDictionaryContext = createContext<
  DataDictionaryContextType | undefined
>(undefined);
