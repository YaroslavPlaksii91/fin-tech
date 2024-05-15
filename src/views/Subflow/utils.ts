import { FlowNode, IFlow } from '@domain/flow';

export const findSubFlow = (
  subFlowId: string,
  nodes: FlowNode[]
): FlowNode | undefined => {
  for (const node of nodes) {
    if (node.id === subFlowId) {
      return node;
    }
    if (node.data?.nodes) {
      const foundNode = findSubFlow(subFlowId, node.data.nodes);
      if (foundNode) {
        return foundNode;
      }
    }
  }
  return undefined;
};

export const updateNodesInSubFlow = (
  nodes: FlowNode[],
  subFlow: IFlow
): FlowNode[] =>
  nodes.map((node: FlowNode) => {
    if (node.id === subFlow.id) {
      node.data.nodes = subFlow.nodes;
      node.data.edges = subFlow.edges;
      node.data.viewport = subFlow.viewport;
    } else if (node.data?.nodes) {
      node.data.nodes = updateNodesInSubFlow(node.data.nodes, subFlow);
    }
    return node;
  });
