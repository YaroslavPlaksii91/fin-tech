import { createContext } from 'react';

import { Variable } from '@domain/dataDictionary';

export type DataDictionaryVariables = Record<string, Variable[]> | undefined;

export type DataDictionaryContextType = {
  variables: DataDictionaryVariables;
  integrationVariables: DataDictionaryVariables;
};

export const DataDictionaryContext = createContext<
  DataDictionaryContextType | undefined
>(undefined);
