import { createContext } from 'react';

import { DataDictionaryVariable } from '@domain/dataDictionary';

type DataDictionaryContextType = {
  variables: DataDictionaryVariable[];
};

export const DataDictionaryContext = createContext<
  DataDictionaryContextType | undefined
>(undefined);
