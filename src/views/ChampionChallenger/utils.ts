import { Edge } from 'reactflow';

import { FlowNode } from '@domain/flow';

export const getConnectedNodesIdDFS = (edges: Edge[], startNodeId: string) => {
  const visited = new Set();
  const connectedNodes: string[] = [];

  function dfs(nodeId: string) {
    visited.add(nodeId);

    if (nodeId !== startNodeId) {
      connectedNodes.push(nodeId);
    }

    for (const edge of edges) {
      if (edge.source === nodeId) {
        const targetNodeId = edge.target;
        if (!visited.has(targetNodeId)) {
          dfs(targetNodeId);
        }
      }
    }
  }

  dfs(startNodeId);

  return connectedNodes;
};

export const unconnectedNodes = (
  nodes: FlowNode[],
  edges: Edge[],
  currentNodeId: string
) =>
  nodes.filter(
    (node) =>
      node.id !== currentNodeId &&
      !edges.some((edge) => edge.source === node.id || edge.target === node.id)
  );
