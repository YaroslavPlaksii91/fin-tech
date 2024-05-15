import { ReactFlowProvider } from 'reactflow';
import { useMemo } from 'react';
import { cloneDeep } from 'lodash';

import { FlowNode, IFlow } from '@domain/flow';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { StepContainer } from '@views/styled';
import FlowChartEditorSubflow from '@components/FlowManagment/FlowChart/FlowChartEditor/FlowChartEditorSubflow';

function findNodeById(id: string, nodes: FlowNode[]): FlowNode | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.data?.nodes) {
      const foundNode = findNodeById(id, node.data.nodes);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return undefined;
}

function updateNodesInSubflows(nodes: FlowNode[], subflow: IFlow): FlowNode[] {
  return nodes.map((node: FlowNode) => {
    if (node.id === subflow.id) {
      node.data.nodes = subflow.nodes;
      node.data.edges = subflow.edges;
      node.data.viewport = subflow.viewport;
    } else if (node.data?.nodes) {
      node.data.nodes = updateNodesInSubflows(node.data.nodes, subflow);
    }
    return node;
  });
}

interface SubflowProps {
  activeStepId: string;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
}

const Subflow: React.FC<SubflowProps> = ({
  rfInstance: { getNodes, setNodes },
  activeStepId,
  resetActiveStepId
}) => {
  const nodes: FlowNode[] = getNodes();

  const saveSubflow = (subflow: IFlow) => {
    const updatedNodes = updateNodesInSubflows(nodes, subflow);
    setNodes(updatedNodes);
    resetActiveStepId();
  };

  const subflow = useMemo(() => {
    const subflowNode = cloneDeep(findNodeById(activeStepId, nodes));
    if (subflowNode) {
      return {
        id: subflowNode.id,
        data: {
          id: subflowNode.id,
          name: subflowNode.data.name,
          createdBy: '',
          createdOn: '',
          editedBy: '',
          editedOn: ''
        },
        nodes: subflowNode.data.nodes,
        edges: subflowNode.data.edges,
        viewport: subflowNode.data.viewport,
        temporaryVariables: [],
        permanentVariables: []
      };
    }
    return undefined;
  }, [activeStepId]);

  return (
    // As subflow is sub instance main flow, it needs own flow provider
    <StepContainer>
      {subflow && (
        <ReactFlowProvider>
          <FlowChartEditorSubflow flow={subflow} setCopyFlow={saveSubflow} />
        </ReactFlowProvider>
      )}
    </StepContainer>
  );
};

export default Subflow;
