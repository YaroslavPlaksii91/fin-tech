import { useCallback, useEffect, useState } from 'react';
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
import { getEdges, getNodes } from './utils/workflowElementsUtils';

const viewport: Viewport = { x: 200, y: 300, zoom: 1 };

interface FlowChartViewProps {
  elements: (Node | Edge)[];
  isEditMode?: boolean;
}

const FlowChartNew: React.FC<FlowChartViewProps> = ({
  elements,
  isEditMode = false
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(
    getNodes(elements)
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(
    getEdges(elements)
  );

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  useEffect(() => {
    const nodes = getNodes(elements);
    const edges = getEdges(elements);
    setEdges(edges);
    setNodes(nodes);
  }, [elements]);

  return (
    <ReactFlowProvider>
      <DagreNodePositioning
        edges={edges}
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
        <Background variant={BackgroundVariant.Lines} />
        {isEditMode && <ControlPanel rfInstance={rfInstance} />}
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default FlowChartNew;
