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

export function removeNodes(nodes: FlowNode[], deleteNodes: FlowNode[]) {
  const deleteIds = new Set(deleteNodes.map((node) => node.id));

  function filterNodes(node: FlowNode) {
    if (deleteIds.has(node.id)) {
      return null;
    }

    if (node.data?.nodes) {
      node.data.nodes = node.data.nodes
        .map((node) => filterNodes(node))
        .filter((node) => node !== null);
    }

    return node;
  }

  return nodes.map((node) => filterNodes(node)).filter((node) => node !== null);
}
