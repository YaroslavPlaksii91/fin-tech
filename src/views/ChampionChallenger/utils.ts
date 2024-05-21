import { Edge } from 'reactflow';

import { FlowNode, IFlow } from '@domain/flow';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { updateNodesInSubFlow } from '@views/Subflow/utils';

export const getConnectableNodes = (nodes: FlowNode[], currentNodeId: string) =>
  nodes.filter(
    (node) => node.id !== currentNodeId && node.type !== StepType.START
  );

export const formatFlowDataForValidation = (
  mainFlow: IFlow | undefined,
  flow: IFlow,
  updatedNodes: FlowNode[],
  updatedEdges: Edge[]
) => {
  let formattedData;
  if (mainFlow) {
    const nodes = updateNodesInSubFlow(mainFlow.nodes, {
      ...flow,
      nodes: updatedNodes,
      edges: updatedEdges
    });
    formattedData = {
      ...mainFlow,
      nodes,
      edges: mainFlow.edges
    };
  } else {
    formattedData = {
      ...flow,
      nodes: updatedNodes,
      edges: updatedEdges
    };
  }

  return formattedData;
};
