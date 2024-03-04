import { createContext, useContext, ReactNode } from 'react';

import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { DataDictionaryVariable } from '@domain/dataDictionary';

export type DataDictionaryContextType = {
  variables: DataDictionaryVariable[];
};

const DataDictionaryContext = createContext<
  DataDictionaryContextType | undefined
>(undefined);

interface DataDictionaryProviderProps {
  children: ReactNode;
}

export const DataDictionaryProvider: React.FC<DataDictionaryProviderProps> = ({
  children
}) => {
  const { variables } = useDataDictionaryVariables();

  const contextValue = {
    variables
  };

  return (
    <DataDictionaryContext.Provider value={contextValue}>
      {children}
    </DataDictionaryContext.Provider>
  );
};

export const useDataDictionary = (): DataDictionaryContextType => {
  const context = useContext(DataDictionaryContext);

  if (!context) {
    throw new Error(
      'useDataDictionary must be used within a DataDictionaryProvider'
    );
  }

  return context;
};
