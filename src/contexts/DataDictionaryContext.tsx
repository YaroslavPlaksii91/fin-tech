import { createContext } from 'react';

import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

export type DataDictionaryVariables =
  | Record<string, DataDictionaryVariable[] | UserDefinedVariable[]>
  | undefined;

export type DataDictionaryContextType = {
  variables: DataDictionaryVariables;
};

export const DataDictionaryContext = createContext<
  DataDictionaryContextType | undefined
>(undefined);
