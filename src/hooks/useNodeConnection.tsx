import { useMemo } from 'react';
import {
  getConnectedEdges,
  useNodeId,
  useStore,
  Node,
  ReactFlowState
} from 'reactflow';

const selector = (state: ReactFlowState) => ({
  nodeInternals: state.nodeInternals,
  edges: state.edges
});

export const useNodeConnection = (
  edgeSourceKey: 'source' | 'sourceHandle',
  sourceId?: string
) => {
  const { nodeInternals, edges } = useStore(selector);
  const nodeId = useNodeId();

  const isConnectable = useMemo(() => {
    if (!nodeId) return true;

    const node = nodeInternals.get(nodeId) as Node;
    const outputEdges = edges.filter((edg) => edg.source === node.id);
    const connectedEdges = getConnectedEdges([node], outputEdges);

    const hasConnection = connectedEdges.some(
      (edg) => edg[edgeSourceKey] === sourceId
    );

    return !hasConnection;
  }, [nodeInternals, edges, nodeId, sourceId]);

  return isConnectable;
};
