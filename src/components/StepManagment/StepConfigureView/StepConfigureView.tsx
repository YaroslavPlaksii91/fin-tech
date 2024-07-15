import ChampionChallenger from '@views/ChampionChallenger/ChampionChallenger';
import DecisionTableStep from '@views/DecisionTable/DecisionTable';
import { IFlow } from '@domain/flow';
import {
  CustomReactFlowInstance,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import Calculation from '@views/Calculation/Calculation';
import { StepContainer } from '@views/styled';

interface StepConfigureViewProps {
  flow: IFlow;
  mainFlow?: IFlow;
  rfInstance: CustomReactFlowInstance;
  activeStepId: string;
  resetActiveStepId: () => void;
  isViewMode: boolean;
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({
  activeStepId,
  resetActiveStepId,
  flow,
  mainFlow,
  rfInstance,
  isViewMode
}) => {
  const currentNode = rfInstance.getNode(activeStepId);
  const step = currentNode;

  return (
    <StepContainer>
      {step?.type === StepType.CHAMPION_CHALLENGER && (
        <ChampionChallenger
          flow={flow}
          step={step}
          mainFlow={mainFlow}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          isViewMode={isViewMode}
        />
      )}
      {step?.type === StepType.DECISION_TABLE && (
        <DecisionTableStep
          flow={flow}
          mainFlow={mainFlow}
          step={step}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          isViewMode={isViewMode}
        />
      )}
      {step?.type === StepType.CALCULATION && (
        <Calculation
          step={step}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          isViewMode={isViewMode}
        />
      )}
    </StepContainer>
  );
};

export default StepConfigureView;
