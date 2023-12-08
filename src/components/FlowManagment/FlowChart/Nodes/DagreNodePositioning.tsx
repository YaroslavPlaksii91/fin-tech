import { useEffect } from 'react';
import { Node, Edge, useStore, ReactFlowState } from 'reactflow';
import dagre from '@dagrejs/dagre';

interface DagreNodePositioningProps {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  edges: Edge[];
  // nodes: Node[];
  // elements: Array<Node | Edge>;
}

const DagreNodePositioning: React.FC<DagreNodePositioningProps> = ({
  setNodes,
  setEdges,
  edges
  // elements
}) => {
  // fetch react flow state
  const getNodeInternals = (state: ReactFlowState) => state.nodeInternals;
  const nodeInternals = useStore(getNodeInternals);
  const flattenedNodes = Array.from(nodeInternals.values());
  const lastElement = flattenedNodes.length - 1;

  useEffect(() => {
    try {
      // node dimensions are not immediately detected, so we want to wait until they are
      if (flattenedNodes[lastElement]?.width) {
        // create dagre graph
        const dagreGraph = new dagre.graphlib.Graph();
        // this prevents error
        dagreGraph.setDefaultEdgeLabel(() => ({}));

        // use dagre graph to layout nodes
        const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
          dagreGraph.setGraph({
            rankdir: 'LR',
            nodesep: 100,
            ranksep: 300,
            edgesep: 200,
            ranker: 'longest-path'
          });

          edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

          nodes.forEach((node) =>
            dagreGraph.setNode(node.id, {
              width: node.width || 0,
              height: node.height || 0
            })
          );

          dagre.layout(dagreGraph);

          return {
            nodes: nodes.map((node) => {
              const { x, y } = dagreGraph.node(node.id);

              return { ...node, position: { x, y } };
            }),
            edges
          };
        };

        // if nodes exist and nodes are not positioned
        if (flattenedNodes.length > 0) {
          const layouted = getLayoutedElements(flattenedNodes, edges);
          setNodes(layouted.nodes);
          setEdges(layouted.edges);
        }
      }
    } catch (error) {
      return undefined;
    }
  }, [flattenedNodes?.length, flattenedNodes[lastElement]?.width]);

  return null;
};

export default DagreNodePositioning;
