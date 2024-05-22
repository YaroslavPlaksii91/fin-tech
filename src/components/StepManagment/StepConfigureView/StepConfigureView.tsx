import { useMemo } from 'react';
import { cloneDeep } from 'lodash';

import ChampionChallenger from '@views/ChampionChallenger/ChampionChallenger';
import DecisionTableStep from '@views/DecisionTable/DecisionTable';
import { IFlow } from '@domain/flow';
import {
  CustomReactFlowInstance,
  StepType
} from '@components/FlowManagment/FlowChart/types';
import Calculation from '@views/Calculation/Calculation';

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
  const step = useMemo(() => {
    const currentNode = rfInstance.getNode(activeStepId);
    return cloneDeep(currentNode);
  }, [activeStepId]);

  return (
    <>
      {step?.type === StepType.CHAMPION_CHALLENGER && (
        <ChampionChallenger
          flow={flow}
          mainFlow={mainFlow}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          step={step}
        />
      )}
      {step?.type === StepType.DECISION_TABLE && (
        <DecisionTableStep
          flow={flow}
          mainFlow={mainFlow}
          step={step}
          resetActiveStepId={resetActiveStepId}
          rfInstance={rfInstance}
        />
      )}
      {step?.type === StepType.CALCULATION && (
        <Calculation
          flow={flow}
          mainFlow={mainFlow}
          rfInstance={rfInstance}
          resetActiveStepId={resetActiveStepId}
          step={step}
        />
      )}
    </>
  );
};

export default StepConfigureView;
