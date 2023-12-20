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
  ConnectionLineType,
  ReactFlowInstance,
  useReactFlow,
  Viewport,
  ReactFlowProvider
} from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from './Nodes';
import { edgeTypes } from './Edges';
import NodePositioning from './Nodes/NodePositioning';
import ControlPanel from './ContolPanel/ControlPanel';
import {
  areOnlyStartAndEndObjects,
  centeredInitialFlowViewport,
  getEdges,
  getNodes
} from './utils/workflowElementsUtils';
import './overview.css';
import { ADD_BUTTON_ON_EDGE } from './types';
import { getLayoutedElements } from './utils/workflowLayoutUtils';

interface FlowChartViewProps {
  elements: (Node | Edge)[];
  data: { viewport: Viewport; id: string };
  isEditMode?: boolean;
}

const FlowChartLayout: React.FC<FlowChartViewProps> = ({
  elements,
  data,
  isEditMode = false
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const { setViewport } = useReactFlow();

  useEffect(() => {
    if (elements.length > 0) {
      const nodes = getNodes(elements);
      const edges = getEdges(elements);
      const { nodes: layoutedNode, edges: layoutedEdge } = getLayoutedElements(
        nodes,
        edges
      );
      setEdges(layoutedEdge);
      setNodes(layoutedNode);
    }
  }, [elements]);

  useEffect(() => {
    if (areOnlyStartAndEndObjects(nodes)) {
      const viewport = centeredInitialFlowViewport();
      setViewport(viewport, { duration: 500 });
    } else {
      setViewport(data.viewport, { duration: 500 });
    }
  }, [data?.viewport, setViewport]);

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
    <>
      <NodePositioning edges={edges} setEdges={setEdges} setNodes={setNodes} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={setRfInstance}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        attributionPosition="bottom-left"
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background variant={BackgroundVariant.Lines} />
        {isEditMode && (
          <ControlPanel flowKey={data.id} rfInstance={rfInstance} />
        )}
      </ReactFlow>
    </>
  );
};

const FlowChart = (props: FlowChartViewProps) => (
  <ReactFlowProvider>
    <FlowChartLayout {...props} />
  </ReactFlowProvider>
);

export default FlowChart;
