// import { useMemo } from 'react';
// import { cloneDeep } from 'lodash';

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
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({
  activeStepId,
  resetActiveStepId,
  flow,
  mainFlow,
  rfInstance
}) => {
  // console.log('activeStepId', activeStepId);
  // const step = useMemo(() => {
  //   const currentNode = rfInstance.getNode(activeStepId);
  //   return currentNode;
  // }, [activeStepId, rfInstance]);
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
        />
      )}
      {step?.type === StepType.DECISION_TABLE && (
        <DecisionTableStep
          flow={flow}
          mainFlow={mainFlow}
          step={step}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
        />
      )}
      {step?.type === StepType.CALCULATION && (
        <Calculation
          flow={flow}
          step={step}
          mainFlow={mainFlow}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
        />
      )}
    </StepContainer>
  );
};

export default StepConfigureView;
