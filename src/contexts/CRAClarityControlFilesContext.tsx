import { createContext } from 'react';

export type CRAClarityControlFilesContextType = string[];

export const CRAClarityControlFilesContext = createContext<
  CRAClarityControlFilesContextType | undefined
>(undefined);
