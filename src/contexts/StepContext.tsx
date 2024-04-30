import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback
} from 'react';
import { useLocation } from 'react-router-dom';

export interface StepContextType {
  activeStepId: string | null;
  setActiveStepId: (step: string | null) => void;
  resetActiveStepId: () => void;
}

const StepContext = createContext<StepContextType | undefined>(undefined);

interface StepProviderProps {
  children: ReactNode;
}

interface LocationState {
  activeStepId?: string;
}

export const StepProvider: React.FC<StepProviderProps> = ({ children }) => {
  const location = useLocation();

  const [activeStepId, setActiveStepId] = useState<null | string>(null);

  const resetActiveStepId = useCallback(
    () => setActiveStepId(null),
    [activeStepId]
  );

  useEffect(() => {
    const state = (location.state || {}) as LocationState;
    if (state.activeStepId) {
      setActiveStepId(state.activeStepId);
    }
  }, [location]);

  const contextValue = {
    activeStepId,
    setActiveStepId,
    resetActiveStepId
  };

  return (
    <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>
  );
};

export const useStep = (): StepContextType => {
  const context = useContext(StepContext);

  if (!context) {
    throw new Error('useStep must be used within a StepProvider');
  }

  return context;
};
