import dagre from '@dagrejs/dagre';
import { Node, Edge } from 'reactflow';

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length > 0) {
    const dagreGraph = new dagre.graphlib.Graph({ multigraph: true });
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({
      rankdir: 'LR',
      nodesep: 100,
      ranksep: 300,
      edgesep: 200,
      ranker: 'tight-tree'
    });

    edges.forEach((edge) =>
      dagreGraph.setEdge(edge.source, edge.target, {}, edge.id)
    );

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
        const calculatedPosition = {
          x: x - (node.width || 0) / 2,
          y: y - (node.height || 0) / 2
        };
        return {
          ...node,
          position: calculatedPosition
        };
      }),
      edges
    };
  } else {
    return { nodes: [], edges: [] };
  }
};

export { getLayoutedElements };
