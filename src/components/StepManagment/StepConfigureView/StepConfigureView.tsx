import { ReactFlowInstance } from 'reactflow';

import { StyledContainer } from './styled';

import ChampionChallenger from '@views/ChampionChallenger/ChampionChallenger';
import { FlowNode } from '@domain/flow';
import { StepType } from '@components/FlowManagment/FlowChart/types';

interface StepConfigureViewProps {
  step: FlowNode;
  rfInstance: ReactFlowInstance;
  // setEdges: (edges: Edge[]) => void;
  // setNodes: (nodes: Node[]) => void;
}

const StepConfigureView: React.FC<StepConfigureViewProps> = ({
  step,
  rfInstance
  // setEdges,
  // setNodes
}) => (
  <StyledContainer>
    {step.type === StepType.CHAMPION_CHALLENGER && (
      <ChampionChallenger
        rfInstance={rfInstance}
        // setNodes={setNodes}
        // setEdges={setEdges}
        step={step}
      />
    )}
  </StyledContainer>
);

export default StepConfigureView;
