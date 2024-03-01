import { createContext } from 'react';

import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

type DataDictionaryContextType = {
  variables:
    | Record<string, DataDictionaryVariable[] | UserDefinedVariable[]>
    | undefined;
};

export const DataDictionaryContext = createContext<
  DataDictionaryContextType | undefined
>(undefined);
