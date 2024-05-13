import { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';

import { StyledContainer } from './styled';

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
  rfInstance: CustomReactFlowInstance;
  activeStepId: string;
  resetActiveStepId: () => void;
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({
  activeStepId,
  resetActiveStepId,
  flow,
  rfInstance
}) => {
  const [step, setStep] = useState<FlowNode>();

  useEffect(() => {
    const currentNode = rfInstance.getNode(activeStepId);
    setStep(cloneDeep(currentNode));
  }, [activeStepId]);

  return (
    <StyledContainer>
      {step?.type === StepType.CHAMPION_CHALLENGER && (
        <ChampionChallenger
          flow={flow}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          step={step}
        />
      )}
      {step?.type === StepType.DECISION_TABLE && (
        <DecisionTableStep
          step={step}
          resetActiveStepId={resetActiveStepId}
          rfInstance={rfInstance}
        />
      )}
      {step?.type === StepType.CALCULATION && (
        <Calculation
          flow={flow}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          step={step}
        />
      )}
    </StyledContainer>
  );
};

export default StepConfigureView;
