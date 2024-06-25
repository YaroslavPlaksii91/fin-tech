import { Edge } from 'reactflow';

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
  subFlow: IFlow,
  username?: string
): FlowNode[] =>
  nodes.map((node: FlowNode) => {
    if (node.id === subFlow.id) {
      node.data = {
        ...node.data,
        editedBy: username || '',
        editedOn: new Date().toISOString(),
        nodes: [...subFlow.nodes],
        edges: [...subFlow.edges],
        viewport: { ...subFlow.viewport }
      };
    } else if (node.data?.nodes) {
      updateNodesInSubFlow(node.data.nodes, subFlow, username);
    }
    return { ...node };
  });

export const addNodeInSubFlow = (
  nodes: FlowNode[],
  subFlowId: string,
  newNode: FlowNode,
  edges: Edge[]
): FlowNode[] =>
  nodes.map((node: FlowNode) => {
    if (node.id === subFlowId) {
      node.data = {
        ...node.data,
        nodes: [...(node?.data?.nodes ?? []), newNode],
        edges: [...edges]
      };
    } else if (node.data?.nodes) {
      addNodeInSubFlow(node.data.nodes, subFlowId, newNode, edges);
    }
    return node;
  });
