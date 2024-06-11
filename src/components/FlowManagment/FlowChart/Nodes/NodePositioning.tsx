import { useEffect } from 'react';
import { Node, Edge } from 'reactflow';

import { getLayoutedElements } from '../utils/workflowLayoutUtils';

import { FlowNode } from '@domain/flow';
interface NodePositioningProps {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  edges: Edge[];
  nodes: FlowNode[];
}

const NodePositioning: React.FC<NodePositioningProps> = ({
  setNodes,
  setEdges,
  nodes,
  edges
}) => {
  // const getNodeInternals = (state: ReactFlowState) => state.nodeInternals;
  // const nodeInternals = useStore(getNodeInternals);
  // const flattenedNodes = Array.from(nodeInternals.values());
  const lastElement = nodes.length - 1;

  useEffect(() => {
    if (nodes[lastElement]?.width) {
      if (nodes.length > 0) {
        const layouted = getLayoutedElements(nodes, edges);
        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      }
    }
  }, [nodes?.length, nodes[lastElement]?.width]);
  // }, [nodes?.length, nodes[lastElement]?.width, edges.length]);

  return null;
};

export default NodePositioning;
