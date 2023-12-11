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
import NodePositioning from './Nodes/NodePositioning';
import ControlPanel from './ContolPanel/ControlPanel';
import { getEdges, getNodes } from './utils/workflowElementsUtils';
import './overview.css';
import { ADD_BUTTON_ON_EDGE } from './types';

const viewport: Viewport = { x: 200, y: 300, zoom: 1 };

interface FlowChartViewProps {
  elements: (Node | Edge)[];
  isEditMode?: boolean;
}

const FlowChart: React.FC<FlowChartViewProps> = ({
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

  useEffect(() => {
    const nodes = getNodes(elements);
    const edges = getEdges(elements);
    setEdges(edges);
    setNodes(nodes);
  }, [elements]);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (connection.source === connection.target) {
        return;
      }
      return setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: ADD_BUTTON_ON_EDGE
          },
          eds
        )
      );
    },
    [setEdges]
  );

  return (
    <ReactFlowProvider>
      <NodePositioning edges={edges} setEdges={setEdges} setNodes={setNodes} />
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
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background variant={BackgroundVariant.Lines} />
        {isEditMode && <ControlPanel rfInstance={rfInstance} />}
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default FlowChart;
