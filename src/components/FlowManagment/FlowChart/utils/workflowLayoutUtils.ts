import dagre from '@dagrejs/dagre';
import { Node, Edge } from 'reactflow';

// const getLayoutedElements = (data: Array<Node | Edge>) => {
//   const elements = _.cloneDeep(data);
//   const dagreGraph = new dagre.graphlib.Graph();

//   dagreGraph.setDefaultEdgeLabel(() => ({}));
//   dagreGraph.setGraph({
//     rankdir: 'LR'
//   });

//   elements.forEach((el) => {
//     if (isNode(el)) {
//       dagreGraph.setNode(el.id, {
//         width: el.width || nodeWidth,
//         height: el.height || nodeHeight
//       });
//     } else {
//       dagreGraph.setEdge(el.source, el.target);
//     }
//   });

//   dagre.layout(dagreGraph);

//   return elements.map((el) => {
//     if (isNode(el)) {
//       const nodeWithPosition = dagreGraph.node(el.id);
//       el.targetPosition = Position.Left;
//       el.sourcePosition = Position.Right;
//       const position = {
//         x: nodeWithPosition.x - (el.width || nodeWidth) / 2,
//         y: nodeWithPosition.y - (el.height || nodeHeight) / 2
//       };
//       el.position = position;
//     }
//     return el;
//   });
// };

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

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

export { getLayoutedElements };
