import { createContext } from 'react';

export type CRAClarityControlFilesContextType = {
  controlFiles: string[];
};

export const CRAClarityControlFilesContext = createContext<
  CRAClarityControlFilesContextType | undefined
>(undefined);
