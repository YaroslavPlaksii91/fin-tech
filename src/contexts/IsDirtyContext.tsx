import { createContext, useContext, ReactNode, useState } from 'react';

export interface IsDirtyContextType {
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}

const IsDirtyContext = createContext<IsDirtyContextType | undefined>(undefined);

interface IsDirtyContextProviderProps {
  children: ReactNode;
}

export const IsDirtyProvider: React.FC<IsDirtyContextProviderProps> = ({
  children
}) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const contextValue = {
    isDirty,
    setIsDirty
  };

  return (
    <IsDirtyContext.Provider value={contextValue}>
      {children}
    </IsDirtyContext.Provider>
  );
};

export const useIsDirty = (): IsDirtyContextType => {
  const context = useContext(IsDirtyContext);

  if (!context) {
    throw new Error('useIsDirty must be used within a IsDirtyProvider');
  }

  return context;
};
