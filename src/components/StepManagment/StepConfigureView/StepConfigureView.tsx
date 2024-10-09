import ChampionChallenger from '@views/ChampionChallenger/ChampionChallenger';
import DecisionTable from '@views/DecisionTable/DecisionTable';
import { IFlow } from '@domain/flow';
import {
  CustomReactFlowInstance,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import Calculation from '@views/Calculation/Calculation';
import { StepContainer } from '@views/styled';
import { useDeselectNodes } from '@hooks/useDeselectNodes';

interface StepConfigureViewProps {
  flow: IFlow;
  rfInstance: CustomReactFlowInstance;
  activeStepId: string;
  resetActiveStepId: () => void;
  isViewMode: boolean;
  mainFlow?: IFlow;
  mainFlowRfInstance?: CustomReactFlowInstance;
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({
  activeStepId,
  resetActiveStepId,
  flow,
  mainFlow,
  rfInstance,
  isViewMode,
  mainFlowRfInstance
}) => {
  const currentNode = rfInstance.getNode(activeStepId);
  const step = currentNode;

  // Need to deselect all nodes to prevent deleting a node when pressing Backspace
  useDeselectNodes();

  return (
    <StepContainer>
      {step?.type === StepType.CHAMPION_CHALLENGER && (
        <ChampionChallenger
          flow={flow}
          step={step}
          mainFlowRfInstance={mainFlowRfInstance}
          mainFlow={mainFlow}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          isViewMode={isViewMode}
        />
      )}
      {step?.type === StepType.DECISION_TABLE && (
        <DecisionTable
          flow={flow}
          mainFlow={mainFlow}
          step={step}
          rfInstance={rfInstance}
          mainFlowRfInstance={mainFlowRfInstance}
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
