import { useEffect } from 'react';
import { Node, Edge, isNode } from 'reactflow';

import { getLayoutedElements } from '../utils/workflowLayoutUtils';

interface DagreNodePositioningProps {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  // edges: Edge[];
  // nodes: Node[];
  elements: Array<Node | Edge>;
}

const DagreNodePositioning: React.FC<DagreNodePositioningProps> = ({
  setNodes,
  setEdges,
  // edges,
  elements
}) => {
  // const [nodesPositioned, setNodesPositioned] = useState(false);

  // fetch react flow state
  // const getNodeInternals = (state: ReactFlowState) => state.nodeInternals;
  // const nodeInternals = useStore(getNodeInternals);
  // const flattenedNodes = Array.from(nodeInternals.values());

  // useEffect(() => {
  //   try {
  //     // node dimensions are not immediately detected, so we want to wait until they are
  //     if (flattenedNodes[0]?.width) {
  //       // create dagre graph
  //       const dagreGraph = new dagre.graphlib.Graph();
  //       // this prevents error
  //       dagreGraph.setDefaultEdgeLabel(() => ({}));

  //       // use dagre graph to layout nodes
  //       const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  //         dagreGraph.setGraph({
  //           rankdir: 'LR',
  //           edgesep: 150,
  //           ranksep: 150,
  //           nodesep: 100
  //         });

  //         edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));

  //         nodes.forEach((node) =>
  //           dagreGraph.setNode(node.id, {
  //             width: node.width || 100,
  //             height: node.height || 100
  //           })
  //         );

  //         dagre.layout(dagreGraph);

  //         return {
  //           nodes: nodes.map((node) => {
  //             const { x, y } = dagreGraph.node(node.id);

  //             return { ...node, position: { x, y } };
  //           }),
  //           edges
  //         };
  //       };

  //       // if nodes exist and nodes are not positioned
  //       if (flattenedNodes.length > 0 && !nodesPositioned) {
  //         console.log('here');
  //         const layouted = getLayoutedElements(flattenedNodes, edges);
  //         setNodes(layouted.nodes);
  //         setEdges(layouted.edges);
  //         setNodesPositioned(true);
  //       }
  //     }
  //   } catch (error) {
  //     console.log('error', error);
  //     return undefined;
  //   }
  // }, []);

  useEffect(() => {
    if (elements?.length > 0) {
      const layouted = getLayoutedElements(elements);

      const nodes = layouted.filter((el) => isNode(el)) as Node[];
      const edges = layouted.filter((el) => !isNode(el)) as Edge[];

      setNodes(nodes);
      setEdges(edges);
    }
  }, [elements]);

  return null;
};

export default DagreNodePositioning;
