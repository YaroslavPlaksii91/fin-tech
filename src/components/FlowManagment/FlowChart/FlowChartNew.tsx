import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Node,
  Edge,
  OnConnect,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Viewport,
  ConnectionLineType,
  ReactFlowProvider,
  ReactFlowInstance
} from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from './Nodes';
import { edgeTypes } from './Edges';
import DagreNodePositioning from './Nodes/DagreNodePositioning';
import ControlPanel from './ContolPanel/ControlPanel';

const viewport: Viewport = { x: 200, y: 300, zoom: 1 };

interface FlowChartViewProps {
  elements: Array<Node | Edge>;
}

const FlowChartNew: React.FC<FlowChartViewProps> = ({ elements }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlowProvider>
      <DagreNodePositioning
        elements={elements}
        setEdges={setEdges}
        setNodes={setNodes}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setRfInstance}
        defaultViewport={viewport}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        attributionPosition="bottom-left"
        connectionLineType={ConnectionLineType.Straight}
      >
        <ControlPanel rfInstance={rfInstance} />
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default FlowChartNew;

// const onAdd = useCallback(
//   (id: string) => {
//     const newNodeId = getNodeId();
//     const newEdgesId = getNodeId();
//     const newNode: Node = {
//       id: newNodeId,
//       data: { label: 'Added node' },
//       position: { x: 0, y: 0 },
//       sourcePosition: Position.Right,
//       targetPosition: Position.Left
//     };
//     setNodes((nodes) => nodes.concat(newNode));

//     setEdges((eds) => {
//       const targetEdgeIndex = eds.findIndex((ed) => ed.id === id);
//       const targetEdge = eds[targetEdgeIndex];
//       const { target: targetNodeId } = targetEdge;

//       const updatedTargetEdge = { ...targetEdge, target: newNodeId };

//       const updatedEdges = [...eds];
//       updatedEdges[targetEdgeIndex] = updatedTargetEdge;

//       const newEdge = {
//         id: newEdgesId,
//         source: newNodeId,
//         target: targetNodeId,
//         type: 'add',
//         data: { onAddNode: onAdd }
//       };

//       return updatedEdges.concat(newEdge);
//     });
//   },
//   [setNodes, setEdges]
// );

// const onNodesDelete = useCallback(
//   (deleted) => {
//     setEdges(
//       deleted.reduce((acc, node) => {
//         const incomers = getIncomers(node, nodes, edges);
//         const outgoers = getOutgoers(node, nodes, edges);
//         const connectedEdges = getConnectedEdges([node], edges);

//         const remainingEdges = acc.filter(
//           (edge) => !connectedEdges.includes(edge)
//         );

//         console.log('remainingEdges', remainingEdges);

//         const createdEdges = incomers.flatMap(({ id: source }) =>
//           outgoers.map(({ id: target }) => ({
//             id: `${source}->${target}`,
//             source,
//             target
//           }))
//         );

//         console.log('createdEdges', createdEdges);

//         return [...remainingEdges, ...createdEdges];
//       }, edges)
//     );
//   },
//   [nodes, edges]
// );
