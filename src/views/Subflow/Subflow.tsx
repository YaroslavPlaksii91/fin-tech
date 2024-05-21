import { ReactFlowProvider } from 'reactflow';
import { useMemo } from 'react';
import { cloneDeep } from 'lodash';

import { addNodeInSubFlow, findSubFlow, updateNodesInSubFlow } from './utils';

import { FlowNode, IFlow } from '@domain/flow';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { StepContainer } from '@views/styled';
import SubFlowChartEditor from '@components/FlowManagment/FlowChart/FlowChartEditor/SubFlowChartEditor';

const SubFlow: React.FC<SubFlowProps> = ({
  mainFlow,
  rfInstance: { getNodes, setNodes },
  activeStepId,
  resetActiveStepId
}) => {
  const nodes: FlowNode[] = getNodes();

  const saveSubflow = (subFlow: IFlow) => {
    const updatedNodes = updateNodesInSubFlow(nodes, subFlow);
    setNodes(updatedNodes);
    resetActiveStepId();
  };

  const subFlow = useMemo(() => {
    const subFlowNode = cloneDeep(findSubFlow(activeStepId, nodes));
    if (subFlowNode) {
      return {
        id: subFlowNode.id,
        data: {
          id: subFlowNode.id,
          name: subFlowNode.data.name,
          createdBy: '',
          createdOn: '',
          editedBy: '',
          editedOn: ''
        },
        nodes: subFlowNode.data.nodes,
        edges: subFlowNode.data.edges,
        viewport: subFlowNode.data.viewport,
        temporaryVariables: [],
        permanentVariables: []
      };
    }
    return undefined;
  }, [activeStepId]);

  const updateNodesInMainFlow = (newNode: FlowNode, subFlow: IFlow) => {
    const updatedNodes = addNodeInSubFlow(nodes, subFlow, newNode);
    setNodes(updatedNodes);
  };

  return (
    // As subFlow is sub instance main flow, it needs own flow provider
    <StepContainer>
      {subFlow && (
        <ReactFlowProvider>
          <SubFlowChartEditor
            mainFlow={mainFlow}
            flow={subFlow}
            setCopyFlow={saveSubflow}
            updateNodesInMainFlow={updateNodesInMainFlow}
          />
        </ReactFlowProvider>
      )}
    </StepContainer>
  );
};

export default SubFlow;

interface SubFlowProps {
  mainFlow: IFlow;
  activeStepId: string;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
}
