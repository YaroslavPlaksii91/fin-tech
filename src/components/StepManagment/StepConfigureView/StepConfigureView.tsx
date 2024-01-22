import { StyledContainer } from './styled';

import ChampionChallenger from '@views/ChampionChallenger/ChampionChallenger';
import { FlowNode } from '@domain/flow';
import { StepType } from '@components/FlowManagment/FlowChart/types';

interface StepConfigureViewProps {
  step: FlowNode;
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({ step }) => (
  <StyledContainer>
    {step.type === StepType.CHAMPION_CHALLENGER && (
      <ChampionChallenger step={step} />
    )}
  </StyledContainer>
);

export default StepConfigureView;
