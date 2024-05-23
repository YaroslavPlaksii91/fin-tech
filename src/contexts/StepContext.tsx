import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback
} from 'react';
import { useLocation } from 'react-router-dom';
interface LocationState {
  subFlowId?: string;
  stepId?: string;
}

export type ActiveStep = { subFlowId: null | string; stepId: null | string };
export interface ActiveStepContextType {
  activeStep: ActiveStep;
  setActiveStep: (value: ActiveStep) => void;
  resetActive: () => void;
}

const ActiveStepContext = createContext<ActiveStepContextType | undefined>(
  undefined
);

interface ActiveStepProviderProps {
  children: ReactNode;
}

export const ActiveStepProvider: React.FC<ActiveStepProviderProps> = ({
  children
}) => {
  const location = useLocation();

  const [activeStep, setActiveStep] = useState<{
    subFlowId: string | null;
    stepId: string | null;
  }>({
    subFlowId: null,
    stepId: null
  });

  useEffect(() => {
    const state = (location.state || {}) as LocationState;
    if (state.subFlowId && state.stepId) {
      setActiveStep({ subFlowId: state.subFlowId, stepId: state.stepId });
    }
  }, [location]);

  const resetActive = useCallback(
    () =>
      setActiveStep({
        subFlowId: null,
        stepId: null
      }),
    [activeStep]
  );

  const contextValue = {
    activeStep,
    setActiveStep,
    resetActive
  };

  return (
    <ActiveStepContext.Provider value={contextValue}>
      {children}
    </ActiveStepContext.Provider>
  );
};

export const useActiveStep = (): ActiveStepContextType => {
  const context = useContext(ActiveStepContext);

  if (!context) {
    throw new Error('useActiveStep must be used within a StepProvider');
  }

  return context;
};
