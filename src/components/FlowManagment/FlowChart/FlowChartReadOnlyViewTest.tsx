import { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  Controls,
  ReactFlowInstance
} from 'reactflow';

import 'reactflow/dist/style.css';

import { nodeTypes } from './Nodes';
import { edgeTypes } from './Edges';
import './overview.css';
import ControlPanelView from './ContolPanels/ControlPanelView';
import { CustomReactFlowInstance } from './types';

import { IFlow } from '@domain/flow';
import StepActionsMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';
import useFlowChartContextMenu from '@hooks/useFlowChartContextMenu';
import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { useActiveStep } from '@contexts/StepContext';

interface FlowChartViewProps {
  flow: IFlow;
  mainFlow?: IFlow;
  isProductionFlow: boolean;
  showControlPanel?: boolean;
}

const FlowChartReadOnlyView: React.FC<FlowChartViewProps> = ({
  flow,
  isProductionFlow,
  mainFlow,
  showControlPanel = false
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);
  const { setViewport } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const { flowNode, nodeElement, onPaneClick, onNodeContextMenu } =
    useFlowChartContextMenu();
  const { activeStep, resetActive } = useActiveStep();

  useEffect(() => {
    setNodes(flow.nodes);
    setEdges(flow.edges);
  }, [flow]);

  useEffect(() => {
    setViewport(flow.viewport);
  }, [flow.viewport, setViewport]);

  return (
    <>
      <ReactFlow
        nodesDraggable={false}
        deleteKeyCode={null}
        nodesConnectable={false}
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        attributionPosition="bottom-left"
        onPaneClick={onPaneClick}
        onInit={(instance) => {
          setRfInstance(instance);
        }}
        onNodeContextMenu={isProductionFlow ? undefined : onNodeContextMenu}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <StepActionsMenu
          subFlowId={mainFlow ? flow.id : null}
          anchorElement={nodeElement}
          flowNode={flowNode}
          isOpen={Boolean(flowNode)}
          onClose={onPaneClick}
        />
        {showControlPanel && <ControlPanelView />}
      </ReactFlow>
      {/* Open read mode for subFlow steps */}
      {rfInstance && activeStep.stepId && activeStep.subFlowId && (
        <StepConfigureView
          flow={flow}
          activeStepId={activeStep.stepId}
          rfInstance={rfInstance as CustomReactFlowInstance}
          resetActiveStepId={resetActive}
        />
      )}
    </>
  );
};

export default FlowChartReadOnlyView;
