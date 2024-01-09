import { useCallback, useEffect } from 'react';
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
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from './Nodes';
import { edgeTypes } from './Edges';
import './overview.css';
import { ADD_BUTTON_ON_EDGE } from './types';
import { getLayoutedElements } from './utils/workflowLayoutUtils';
import ControlPanelView from './ContolPanel/ControlPanelView';

import { IFlow } from '@domain/flow';

interface FlowChartViewProps {
  flow: IFlow;
  isViewMode?: boolean;
}

const FlowChartViewLayout: React.FC<FlowChartViewProps> = ({
  flow,
  isViewMode = false
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const { setViewport } = useReactFlow();

  useEffect(() => {
    if (flow) {
      const { nodes: layoutedNode, edges: layoutedEdge } = getLayoutedElements(
        flow.nodes,
        flow.edges
      );
      setEdges(layoutedEdge);
      setNodes(layoutedNode);
    }
  }, [flow]);

  useEffect(() => {
    setViewport(flow.viewport, { duration: 500 });
  }, [flow.viewport, setViewport]);

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
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      attributionPosition="bottom-left"
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <Background variant={BackgroundVariant.Lines} />
      {isViewMode && <ControlPanelView flowId={flow.id} />}
    </ReactFlow>
  );
};

const FlowChartView = (props: FlowChartViewProps) => (
  <ReactFlowProvider>
    <FlowChartViewLayout {...props} />
  </ReactFlowProvider>
);

export default FlowChartView;
