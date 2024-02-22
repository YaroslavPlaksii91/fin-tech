import { StyledContainer } from './styled';

import { MAIN_STEP_ID } from '@constants/common';
import ChampionChallenger from '@views/ChampionChallenger/ChampionChallenger';
import DecisionTableStep from '@views/DecisionTable/DecisionTable';
import { FlowNode, IFlow } from '@domain/flow';
import {
  CustomReactFlowInstance,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import Calculation from '@views/Calculation/Calculation';

interface StepConfigureViewProps {
  flow: IFlow;
  step: FlowNode;
  setStep: (step: FlowNode | { id: typeof MAIN_STEP_ID }) => void;
  rfInstance: CustomReactFlowInstance;
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({
  step,
  setStep,
  flow,
  rfInstance
}) => (
  <StyledContainer>
    {step.type === StepType.CHAMPION_CHALLENGER && (
      <ChampionChallenger
        flow={flow}
        rfInstance={rfInstance}
        setStep={setStep}
        step={step}
      />
    )}
    {step.type === StepType.DECISION_TABLE && <DecisionTableStep step={step} />}
    {step.type === StepType.CALCULATION && (
      <Calculation
        flow={flow}
        rfInstance={rfInstance}
        setStep={setStep}
        step={step}
      />
    )}
  </StyledContainer>
);

export default StepConfigureView;
