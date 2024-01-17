import { useEffect } from 'react';
import { Node, Edge, useStore, ReactFlowState } from 'reactflow';

import { getLayoutedElements } from '../utils/workflowLayoutUtils';
interface NodePositioningProps {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  edges: Edge[];
}

const NodePositioning: React.FC<NodePositioningProps> = ({
  setNodes,
  setEdges,
  edges
}) => {
  const getNodeInternals = (state: ReactFlowState) => state.nodeInternals;
  const nodeInternals = useStore(getNodeInternals);
  const flattenedNodes = Array.from(nodeInternals.values());
  const lastElement = flattenedNodes.length - 1;

  useEffect(() => {
    if (flattenedNodes[lastElement]?.width) {
      if (flattenedNodes.length > 0) {
        const layouted = getLayoutedElements(flattenedNodes, edges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      }
    }
  }, [
    flattenedNodes?.length,
    flattenedNodes[lastElement]?.width,
    edges.length
  ]);

  return null;
};

export default NodePositioning;
