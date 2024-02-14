import { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Node,
  OnConnect,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ConnectionLineType,
  useReactFlow,
  ReactFlowProvider,
  Edge,
  ConnectionMode
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce';
import 'reactflow/dist/style.css';

import FlowHeader from '../../FlowHeader';
import { nodeTypes } from '../Nodes';
import { edgeTypes } from '../Edges';
import NodePositioning from '../Nodes/NodePositioning';
import '../overview.css';
import {
  ADD_BUTTON_ON_EDGE,
  CustomReactFlowInstance,
  EdgeData,
  StepType
} from '../types';
import ControlPanelEdit from '../ContolPanels/ControlPanelEdit';
import {
  checkIfFlowIsEdit,
  checkIfNodeHasConnection,
  checkIfNodeIsInitial,
  createNewNode,
  elementsOverlap,
  updateEdges
} from '../utils/workflowElementsUtils';
import { getLayoutedElements } from '../utils/workflowLayoutUtils';

import NavigationHeader from './NavigateHeader';

import { FlowNode, IFlow } from '@domain/flow';
import {
  MainContainer,
  SideNavContainer
} from '@components/Layouts/MainLayout';
import { SelectStep } from '@components/StepManagment/StepSelectionDialog/SelectStep';
import StepList from '@components/StepManagment/StepList/StepList';
import { useStep } from '@contexts/StepContext';
import StepConfigureView from '@components/StepManagment/StepConfigureView/StepConfigureView';
import { MAIN_STEP_ID } from '@constants/common';
import ConfirmationDialog from '@components/shared/Confirmation/Confirmation';
import useFlowChartContextMenu from '@hooks/useFlowChartContextMenu';
import StepActionMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';

interface FlowChartViewProps {
  flow: IFlow;
  setFlow: (flow: IFlow) => void;
}

const FlowChartEditorLayout: React.FC<FlowChartViewProps> = ({
  flow,
  setFlow
}) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [rfInstance, setRfInstance] = useState<CustomReactFlowInstance>();
  const [startDrag, setStartDrag] = useState<boolean>(false);
  const { menu, setMenu, onPaneClick, onNodeContextMenu } =
    useFlowChartContextMenu();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { step, setStep } = useStep();

  const { setViewport } = useReactFlow();

  const onAddNodeBetweenEdges = useCallback(
    (type: StepType, name: string, edgeId: string) => {
      const newEdgeId = uuidv4();
      const newNode = createNewNode(type, name, newEdgeId);

      setNodes((nodes) => nodes.concat(newNode));

      setEdges((edges) =>
        updateEdges({
          edges,
          updatableEdgeId: edgeId,
          newNodeId: newNode.id,
          newEdgeId,
          onAddNodeBetweenEdges
        })
      );

      return newNode;
    },
    [setNodes, setEdges]
  );

  const initialElements = useMemo(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      flow.nodes,
      flow.edges
    );
    const edges = layoutedEdges.map((edge) => ({
      ...edge,
      type: ADD_BUTTON_ON_EDGE,
      data: { onAdd: onAddNodeBetweenEdges }
    }));
    const nodes = layoutedNodes;
    return { edges, nodes };
  }, [flow]);

  useEffect(() => {
    setEdges(initialElements.edges);
    setNodes(initialElements.nodes);
  }, [initialElements]);

  useEffect(() => {
    setViewport(flow.viewport);
  }, [flow.viewport, setViewport]);

  const checkIsDirty = ({
    initialNodes,
    initialEdges,
    nodes,
    edges
  }: {
    initialNodes: Node[];
    initialEdges: Edge[];
    nodes: Node[];
    edges: Edge[];
  }) => {
    const isFlowEdit = checkIfFlowIsEdit({
      initialNodes,
      initialEdges,
      nodes,
      edges
    });

    if (isFlowEdit) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  };

  const debounceCheckIsDirty = useCallback(debounce(checkIsDirty, 300), []);

  useEffect(() => {
    debounceCheckIsDirty({
      initialNodes: initialElements.nodes,
      initialEdges: initialElements.edges,
      nodes,
      edges
    });
  }, [initialElements, nodes, edges]);

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const edgeId = uuidv4();
      if (connection.source === connection.target) {
        return;
      }

      if (rfInstance) {
        // Update edgeId of splits Champion Challenger data
        if (connection.source) {
          const connectedNode = rfInstance.getNode(
            connection.source
          ) as FlowNode;
          if (
            connectedNode?.type === StepType.CHAMPION_CHALLENGER &&
            connection.sourceHandle !== null
          ) {
            const updatedSplits =
              connectedNode.data.splits?.map((split, index) => {
                if (index === +connection.sourceHandle!) {
                  return { ...split, edgeId };
                }
                return split;
              }) ?? [];

            const updatedNodes = rfInstance.getNodes().map((node: FlowNode) => {
              if (node.id === connectedNode?.id) {
                node.data.splits = [...updatedSplits];
              }
              return node;
            });
            setNodes(updatedNodes);
          }
        }

        setEdges((eds) =>
          addEdge(
            {
              ...connection,
              id: edgeId,
              sourceHandle: connection.sourceHandle,
              data: { onAdd: onAddNodeBetweenEdges },
              type: ADD_BUTTON_ON_EDGE
            },
            eds
          )
        );
      }
    },
    [setEdges, setNodes, rfInstance]
  );

  const onAddNode = useCallback(
    (type: StepType, name: string) => {
      const newNode = createNewNode(type, name);
      setNodes((nds) => nds.concat(newNode));
      return newNode;
    },
    [setNodes]
  );

  const onConnectNode = useCallback(
    (updatedNode: FlowNode, edgeId: string) => {
      const newEdgeId = uuidv4();
      if (updatedNode.type === StepType.CHAMPION_CHALLENGER && rfInstance) {
        const updatedSplits =
          updatedNode.data.splits?.map((split, index) => {
            if (index === 0) {
              return { ...split, edgeId: newEdgeId };
            }
            return split;
          }) ?? [];

        const updatedNodes = rfInstance.getNodes().map((node: FlowNode) => {
          if (node.id === updatedNode?.id) {
            node.data.splits = [...updatedSplits];
          }
          return node;
        });
        setNodes(updatedNodes);
      }
      setEdges((edges) =>
        updateEdges({
          edges,
          updatableEdgeId: edgeId,
          newNodeId: updatedNode.id,
          newEdgeId,
          onAddNodeBetweenEdges
        })
      );
    },
    [setNodes, setEdges, rfInstance]
  );

  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const nodeIsInitial = checkIfNodeIsInitial(node);
      if (nodeIsInitial) return;

      const nodeHasConnection = checkIfNodeHasConnection(edges, node.id);

      if (nodeHasConnection) return;

      setStartDrag(false);

      const sourceNode = document.getElementById(node.id);
      const edgesAddButtons = document.querySelectorAll(
        `[data-edge-type=${ADD_BUTTON_ON_EDGE}]`
      );

      if (sourceNode) {
        const overlapedEdge = Array.from(edgesAddButtons).find((edge) =>
          elementsOverlap(sourceNode, edge)
        );
        if (overlapedEdge?.id) {
          onConnectNode(node, overlapedEdge.id);
        }
      }
    },
    [edges]
  );

  const onNodeDragStart = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      const nodeIsInitial = checkIfNodeIsInitial(node);
      if (nodeIsInitial) return;

      const nodeHasConnection = checkIfNodeHasConnection(edges, node.id);
      if (nodeHasConnection) return;

      setStartDrag(true);
    },
    [setStartDrag, startDrag, edges]
  );

  const onEdgesDelete = useCallback(
    (edges: Edge[]) => {
      const deletedEdge = edges[0];
      const updatedNode: FlowNode | undefined = rfInstance?.getNode(
        deletedEdge.source
      );
      if (
        updatedNode &&
        updatedNode.type === StepType.CHAMPION_CHALLENGER &&
        rfInstance &&
        deletedEdge.sourceHandle
      ) {
        const updatedSplits =
          updatedNode.data.splits?.map((split, index) => {
            if (index === +deletedEdge.sourceHandle!) {
              return { ...split, edgeId: null };
            }
            return split;
          }) ?? [];

        const updatedNodes = rfInstance.getNodes().map((node: FlowNode) => {
          if (node.id === updatedNode?.id) {
            node.data.splits = [...updatedSplits];
          }
          return node;
        });
        setNodes(updatedNodes);
      }
    },
    [rfInstance, nodes]
  );

  useEffect(() => {
    setEdges((eds: Edge<EdgeData>[]) =>
      eds.map((edge) => ({
        ...edge,
        data: { ...edge.data, animated: startDrag }
      }))
    );
  }, [startDrag]);

  return (
    <>
      <SideNavContainer
        header={<NavigationHeader />}
        footer={<SelectStep onAddNode={onAddNode} />}
      >
        <FlowHeader name={flow.data.name} />
        <StepList nodes={nodes} step={step} setStep={setStep} />
      </SideNavContainer>
      <MainContainer>
        <NodePositioning
          edges={edges}
          setEdges={setEdges}
          setNodes={setNodes}
        />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          autoPanOnNodeDrag
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDragStop={onNodeDragStop}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgesDelete={onEdgesDelete}
          onNodeDragStart={onNodeDragStart}
          onInit={(instance) => {
            setRfInstance({
              ...instance,
              onAddNodeBetweenEdges
            });
          }}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          attributionPosition="bottom-left"
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background variant={BackgroundVariant.Lines} />
          <ControlPanelEdit
            flow={flow}
            isDirty={isDirty}
            setFlow={setFlow}
            rfInstance={rfInstance}
          />
        </ReactFlow>
        {rfInstance && step.id !== MAIN_STEP_ID && (
          <StepConfigureView
            flow={flow}
            setStep={setStep}
            rfInstance={rfInstance}
            step={step as FlowNode}
          />
        )}
      </MainContainer>
      <StepActionMenu anchorEl={menu} setAnchorEl={setMenu} />
      <ConfirmationDialog isDirty={isDirty} />
    </>
  );
};

const FlowChartEditor = (props: FlowChartViewProps) => (
  <ReactFlowProvider>
    <FlowChartEditorLayout {...props} />
  </ReactFlowProvider>
);

export default FlowChartEditor;
