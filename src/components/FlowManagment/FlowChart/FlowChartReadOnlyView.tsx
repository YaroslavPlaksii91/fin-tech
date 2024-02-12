import { useEffect } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from './Nodes';
import { edgeTypes } from './Edges';
import './overview.css';
import ControlPanelView from './ContolPanels/ControlPanelView';

import { IFlow } from '@domain/flow';
import StepActionMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';
import useFlowChartContextMenu from '@hooks/useFlowChartContextMenu';

interface FlowChartViewProps {
  flow: IFlow;
  isProductionFlow: boolean;
  showControlPanel?: boolean;
}

const FlowChartReadOnlyViewLayout: React.FC<FlowChartViewProps> = ({
  flow,
  isProductionFlow,
  showControlPanel = false
}) => {
  const [nodes, setNodes] = useNodesState(flow.nodes);
  const [edges, setEdges] = useEdgesState(flow.edges);
  const { setViewport } = useReactFlow();
  const { menu, setMenu, onPaneClick, onNodeContextMenu } =
    useFlowChartContextMenu();

  useEffect(() => {
    setNodes(flow.nodes);
    setEdges(flow.edges);
  }, [flow]);

  useEffect(() => {
    setViewport(flow.viewport);
  }, [flow.viewport, setViewport]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      attributionPosition="bottom-left"
      onPaneClick={onPaneClick}
      onNodeContextMenu={isProductionFlow ? undefined : onNodeContextMenu}
    >
      <Background variant={BackgroundVariant.Lines} />
      <StepActionMenu anchorEl={menu} setAnchorEl={setMenu} />
      {showControlPanel && <ControlPanelView />}
    </ReactFlow>
  );
};

const FlowChartReadOnlyView = (props: FlowChartViewProps) => (
  <ReactFlowProvider>
    <FlowChartReadOnlyViewLayout {...props} />
  </ReactFlowProvider>
);

export default FlowChartReadOnlyView;
