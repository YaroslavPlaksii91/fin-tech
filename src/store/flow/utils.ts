import { FlowNode } from '@domain/flow';

export function addNodeToSubflow(
  nodes: FlowNode[],
  subflowId: string,
  newNode: FlowNode
): FlowNode[] {
  return nodes.map((node) => {
    if (node.id === subflowId) {
      return {
        ...node,
        data: {
          ...node.data,
          nodes: [...(node.data.nodes ?? []), newNode]
        }
      };
    }
    if (node.data.nodes) {
      return {
        ...node,
        data: {
          ...node.data,
          nodes: addNodeToSubflow(node.data.nodes, subflowId, newNode)
        }
      };
    }
    return node;
  });
}

export function removeNodesInSubflow(
  nodes: FlowNode[],
  deleteNodes: FlowNode[],
  subflowId: string | null
): FlowNode[] {
  return nodes.map((node) => {
    if (node.id === subflowId) {
      return {
        ...node,
        data: {
          ...node.data,
          nodes: node.data?.nodes?.filter(
            (node) => !deleteNodes.find((item) => item.id === node.id)
          )
        }
      };
    } else if (node.data.nodes) {
      return {
        ...node,
        nodes: removeNodesInSubflow(node.data.nodes, deleteNodes, subflowId)
      };
    }
    return node;
  });
}
