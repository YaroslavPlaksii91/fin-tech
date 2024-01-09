import { useEffect } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider
  // ReactFlowInstance
} from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from './Nodes';
import { edgeTypes } from './Edges';
import './overview.css';
import ControlPanelView from './ContolPanel/ControlPanelView';

import { IFlow } from '@domain/flow';

interface FlowChartViewProps {
  flow: IFlow;
  showControlPanel?: boolean;
}

const FlowChartReadOnlyViewLayout: React.FC<FlowChartViewProps> = ({
  flow,
  showControlPanel = false
}) => {
  const [nodes, setNodes] = useNodesState(flow.nodes);
  const [edges, setEdges] = useEdgesState(flow.edges);
  // const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  // const [anchorEl, setAnchorEl] = useState(null);
  // const onPaneClick = useCallback(() => setAnchorEl(null), [setAnchorEl]);

  const { setViewport } = useReactFlow();

  useEffect(() => {
    setNodes(flow.nodes);
    setEdges(flow.edges);
  }, [flow]);

  useEffect(() => {
    setViewport(flow.viewport);
  }, [flow.viewport, setViewport]);

  // const handleOpenMenu = (event: React.MouseEvent) => {
  //   // event.stopPropagation();
  //   setAnchorEl(event);
  // };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      attributionPosition="bottom-left"
      // onPaneClick={onPaneClick}
      // onNodeClick={handleOpenMenu}
    >
      <Background variant={BackgroundVariant.Lines} />
      {showControlPanel && <ControlPanelView flowId={flow.id} />}
    </ReactFlow>
  );
};

const FlowChartReadOnlyView = (props: FlowChartViewProps) => (
  <ReactFlowProvider>
    <FlowChartReadOnlyViewLayout {...props} />
  </ReactFlowProvider>
);

export default FlowChartReadOnlyView;
