import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect
} from 'react';
import { useLocation } from 'react-router-dom';

import { FlowNode } from '@domain/flow';
import { MAIN_STEP_ID } from '@constants/common';

export type StepContextType = {
  step: FlowNode | { id: typeof MAIN_STEP_ID };
  setStep: (step: FlowNode | { id: typeof MAIN_STEP_ID }) => void;
};

const StepContext = createContext<StepContextType | undefined>(undefined);

interface StepProviderProps {
  children: ReactNode;
}

interface LocationState {
  node?: FlowNode;
}

export const StepProvider: React.FC<StepProviderProps> = ({ children }) => {
  const location = useLocation();

  const [step, setStep] = useState<FlowNode | { id: typeof MAIN_STEP_ID }>({
    id: MAIN_STEP_ID
  });

  useEffect(() => {
    const state = (location.state || {}) as LocationState;
    if (state.node) {
      setStep(state.node);
    }
  }, [location]);

  const contextValue = {
    step,
    setStep
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
