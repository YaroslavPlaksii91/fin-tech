import { Edge } from 'reactflow';

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
