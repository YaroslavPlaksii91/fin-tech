import { createContext } from 'react';

import { DataDictionaryVariable } from '@domain/dataDictionary';

type DataDictionaryContextType = {
  variables: Record<string, DataDictionaryVariable[]> | undefined;
};

export const DataDictionaryContext = createContext<
  DataDictionaryContextType | undefined
>(undefined);
