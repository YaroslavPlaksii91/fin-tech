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
  Edge,
  ConnectionMode,
  Controls
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import 'reactflow/dist/style.css';
import debounce from 'lodash/debounce';

import { nodeTypes } from '../Nodes';
import { edgeTypes } from '../Edges';
import NodePositioning from '../Nodes/NodePositioning';
import '../overview.css';
import {
  ADD_BUTTON_ON_EDGE,
  ControlPanelProps,
  CustomReactFlowInstance,
  DEFAULT_EDGE_TYPE,
  EdgeData,
  StepConfigureViewProps,
  StepType
} from '../types';
import {
  checkIfFlowIsEdit,
  checkIfNodeHasConnection,
  checkIfNodeIsInitial,
  createNewNode,
  elementsOverlap,
  getUpdatedChampionChallengerNodes,
  getUpdatedDecisionTableNodes,
  updateEdges
} from '../utils/workflowElementsUtils';
import { getLayoutedElements } from '../utils/workflowLayoutUtils';
import {
  CUSTOM_FLOW_EVENT,
  CUSTOM_FLOW_EVENT_RENAME,
  DEFAULT_SOURCE_HANDLE
} from '../constants';

import LeavePageConfirmationDialog from '@components/shared/Confirmation/LeavePageConfirmationDialog.tsx';
import { FlowNode, IFlow } from '@domain/flow';
import { useActiveStep } from '@contexts/StepContext';
import useFlowChartContextMenu from '@hooks/useFlowChartContextMenu';
import StepActionsMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectUserInfo } from '@store/auth/auth';
import { getFullUserName } from '@utils/helpers';
import { deleteNodes } from '@store/flow/flow';
import { useIsDirty } from '@contexts/IsDirtyContext';

type FlowChartEditorProps = {
  flow: IFlow;
  setCopyFlow: (flow: IFlow) => void;
  isViewMode: boolean;
  mainFlow?: IFlow;
  mainFlowRfInstance?: CustomReactFlowInstance;
  addNodeAndSyncMainFlow?: (
    subflowId: string,
    newNode: FlowNode,
    edges: Edge[]
  ) => void;
  deleteNodeAndSyncMainFlow?: (deleteNodes: FlowNode[]) => void;
  updateNodeNameAndSyncMainFlow?: (updatedNode: FlowNode) => void;
};

const withFlowChartEditor =
  (
    StepConfigureView: React.ComponentType<StepConfigureViewProps>,
    ControlPanel: React.ComponentType<ControlPanelProps>
  ) =>
  // eslint-disable-next-line react/display-name
  (props: FlowChartEditorProps) => {
    const {
      flow,
      mainFlow,
      setCopyFlow,
      addNodeAndSyncMainFlow,
      deleteNodeAndSyncMainFlow,
      updateNodeNameAndSyncMainFlow,
      isViewMode,
      mainFlowRfInstance
    } = props;

    const user = useAppSelector(selectUserInfo);
    const dispatch = useAppDispatch();

    const { isDirty, setIsDirty } = useIsDirty();

    const [rfInstance, setRfInstance] = useState<CustomReactFlowInstance>();
    const [startDrag, setStartDrag] = useState<boolean>(false);
    const { flowNode, nodeElement, onPaneClick, onNodeContextMenu } =
      useFlowChartContextMenu();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const { setViewport } = useReactFlow();

    const { activeStep, setActiveStep } = useActiveStep();

    const [newNode, setNewNode] = useState<FlowNode | null>(null);

    const handleDeleteElements = useCallback(
      (e: CustomEvent<{ subFlowId: string; deleteNodes: FlowNode[] }>) => {
        const { subFlowId, deleteNodes } = e.detail;
        if (subFlowId === flow.id && rfInstance) {
          rfInstance.deleteElements({ nodes: deleteNodes });
        }
      },
      [rfInstance, flow.id]
    );

    const handleRenameNode = useCallback(
      (e: CustomEvent<{ updatedNode: FlowNode; subFlowId: string }>) => {
        const { updatedNode, subFlowId } = e.detail;
        if (subFlowId === flow.id) {
          const updatedNodes = nodes.map((node: FlowNode) => {
            if (node.id === updatedNode.id) {
              node.data = { ...node.data, name: updatedNode.data.name };
            }
            return node;
          });
          updateNodeNameAndSyncMainFlow?.(updatedNode);
          setNodes(updatedNodes);
        }
      },
      [rfInstance, flow.id, nodes]
    );

    useEffect(() => {
      document.addEventListener(CUSTOM_FLOW_EVENT, (e) => {
        handleDeleteElements(e);
      });

      return () => {
        document.removeEventListener(CUSTOM_FLOW_EVENT, handleDeleteElements);
      };
    }, [rfInstance, flow.id]);

    useEffect(() => {
      document.addEventListener(CUSTOM_FLOW_EVENT_RENAME, handleRenameNode);

      return () => {
        document.removeEventListener(
          CUSTOM_FLOW_EVENT_RENAME,
          handleRenameNode
        );
      };
    }, [rfInstance, flow.id, nodes]);

    useEffect(() => {
      if (mainFlow && newNode) {
        addNodeAndSyncMainFlow?.(flow.id, newNode, edges);
        setNewNode(null);
      }
    }, [newNode]);

    const onAddNodeBetweenEdges = useCallback(
      (type: StepType, name: string, edgeId: string) => {
        const newEdgeId = uuidv4();
        const username = getFullUserName(user);
        const newNode = createNewNode(type, name, username, newEdgeId);

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

        setNewNode(newNode);
        return { newNode, flowId: flow.id };
      },
      [setNodes, setEdges, flow.id]
    );

    const initialElements = useMemo(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(flow.nodes, flow.edges);
      const edges = layoutedEdges.map((edge) => ({
        ...edge,
        type: isViewMode ? DEFAULT_EDGE_TYPE : ADD_BUTTON_ON_EDGE,
        data: { onAdd: onAddNodeBetweenEdges }
      }));
      const nodes = layoutedNodes;
      return { edges, nodes };
    }, [flow, isViewMode]);

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
        const newEdgeId = uuidv4();
        if (connection.source === connection.target) return;

        if (rfInstance && connection.source) {
          const updatedNode = rfInstance.getNode(connection.source) as FlowNode;

          // Update edgeId of entries Desion Table data
          if (
            updatedNode?.type === StepType.DECISION_TABLE &&
            connection.sourceHandle !== null
          ) {
            const updatedNodes = getUpdatedDecisionTableNodes({
              nodes,
              updatedNode,
              newEdgeId,
              sourceHandle: connection.sourceHandle
            });

            setNodes(updatedNodes);
          }

          // Update edgeId of splits Champion Challenger data
          if (
            updatedNode?.type === StepType.CHAMPION_CHALLENGER &&
            connection.sourceHandle !== null
          ) {
            const updatedNodes = getUpdatedChampionChallengerNodes({
              nodes,
              updatedNode,
              newEdgeId,
              sourceHandle: connection.sourceHandle
            });
            setNodes(updatedNodes);
          }

          setEdges((eds) =>
            addEdge(
              {
                ...connection,
                id: newEdgeId,
                sourceHandle: connection.sourceHandle,
                data: { onAdd: onAddNodeBetweenEdges },
                type: ADD_BUTTON_ON_EDGE
              },
              eds
            )
          );
        }
      },
      [setEdges, setNodes, rfInstance, nodes]
    );

    const onConnectNode = useCallback(
      (updatedNode: FlowNode, edgeId: string) => {
        const newEdgeId = uuidv4();
        let sourceHandle: string | null = null;

        // Update edgeId of entries Desion Table data
        if (updatedNode.type === StepType.DECISION_TABLE && rfInstance) {
          sourceHandle = DEFAULT_SOURCE_HANDLE;
          const updatedNodes = getUpdatedDecisionTableNodes({
            nodes,
            updatedNode,
            newEdgeId: edgeId,
            sourceHandle
          });
          setNodes(updatedNodes);
        }

        // Update edgeId of splits Champion Challenger data
        if (updatedNode.type === StepType.CHAMPION_CHALLENGER && rfInstance) {
          sourceHandle = DEFAULT_SOURCE_HANDLE;
          const updatedNodes = getUpdatedChampionChallengerNodes({
            nodes,
            updatedNode,
            newEdgeId: edgeId,
            sourceHandle
          });
          setNodes(updatedNodes);
        }

        setEdges((edges) =>
          updateEdges({
            sourceHandle,
            edges,
            updatableEdgeId: edgeId,
            newNodeId: updatedNode.id,
            newEdgeId,
            onAddNodeBetweenEdges
          })
        );
      },
      [setNodes, setEdges, rfInstance, nodes]
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
          `[data-flow-id='${flow.id}'] [data-edge-type='${ADD_BUTTON_ON_EDGE}`
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
      [edges, flow.id]
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

        // Update edgeId of entries Desion Table data
        if (
          updatedNode?.type === StepType.DECISION_TABLE &&
          rfInstance &&
          deletedEdge.sourceHandle
        ) {
          const updatedNodes = getUpdatedDecisionTableNodes({
            nodes,
            updatedNode,
            newEdgeId: null,
            sourceHandle: deletedEdge.sourceHandle
          });

          setNodes(updatedNodes);
        }

        // Update edgeId of splits Champion Challenger data
        if (
          updatedNode?.type === StepType.CHAMPION_CHALLENGER &&
          rfInstance &&
          deletedEdge.sourceHandle
        ) {
          const updatedNodes = getUpdatedChampionChallengerNodes({
            nodes,
            updatedNode,
            newEdgeId: null,
            sourceHandle: deletedEdge.sourceHandle
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

    const onNodesDelete = useCallback(
      (deletedNodes: FlowNode[]) => {
        if (mainFlow) {
          deleteNodeAndSyncMainFlow?.(deletedNodes);
        }
        dispatch(deleteNodes({ deletedNodes }));
      },
      [flow.id]
    );

    const onNodeDoubleClick = useCallback(
      (_e: React.MouseEvent, node: FlowNode) => {
        let subFlowId = null;
        let stepId = null;
        if (
          node.data.stepType === StepType.START ||
          node.data.stepType === StepType.END
        ) {
          return;
        }
        if (node.data.stepType === StepType.SUBFLOW) {
          subFlowId = node.id;
        } else {
          subFlowId = mainFlow ? flow.id : null;
          stepId = node.id;
        }
        setActiveStep({ subFlowId, stepId });
      },
      [flow.id, mainFlow]
    );

    return (
      <>
        <NodePositioning
          edges={edges}
          nodes={nodes}
          setEdges={setEdges}
          setNodes={setNodes}
        />
        <ReactFlow
          id={flow.id}
          data-flow-id={flow.id}
          nodes={nodes}
          edges={edges}
          autoPanOnNodeDrag
          onNodesDelete={isViewMode ? undefined : onNodesDelete}
          onNodesChange={isViewMode ? undefined : onNodesChange}
          onEdgesChange={isViewMode ? undefined : onEdgesChange}
          onConnect={isViewMode ? undefined : onConnect}
          nodesConnectable={!isViewMode}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDragStop={onNodeDragStop}
          onEdgesDelete={onEdgesDelete}
          onNodeDragStart={onNodeDragStart}
          onNodeDoubleClick={onNodeDoubleClick}
          onInit={(instance) => {
            setRfInstance({
              ...instance,
              onAddNodeBetweenEdges
            });
          }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          attributionPosition="bottom-left"
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background variant={BackgroundVariant.Dots} />
          {rfInstance && flow.id && (
            <ControlPanel
              mainFlow={mainFlow}
              flow={flow}
              setCopyFlow={setCopyFlow}
              isDirty={isDirty}
              rfInstance={rfInstance}
              isViewMode={isViewMode}
            />
          )}
          <Controls />
        </ReactFlow>
        {rfInstance && (
          <StepConfigureView
            mainFlow={mainFlow}
            flow={flow}
            rfInstance={rfInstance}
            mainFlowRfInstance={mainFlowRfInstance}
            isViewMode={isViewMode}
          />
        )}
        <StepActionsMenu
          subFlowId={mainFlow ? flow.id : null}
          activeStep={activeStep}
          anchorElement={nodeElement}
          flowNode={flowNode}
          isOpen={Boolean(flowNode)}
          onClose={onPaneClick}
          isEditMode={!isViewMode}
          setActiveStep={setActiveStep}
        />
        {!isViewMode && <LeavePageConfirmationDialog isDirty={isDirty} />}
      </>
    );
  };
export default withFlowChartEditor;
