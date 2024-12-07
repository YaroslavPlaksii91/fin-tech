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
  Controls,
  XYPosition,
  updateEdge,
  Connection
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import 'reactflow/dist/style.css';
import * as _ from 'lodash-es';
import { differenceBy } from 'lodash-es';

import { nodeTypes } from '../Nodes';
import { edgeTypes } from '../Edges';
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
  connectionLineStyle,
  createNewNode,
  elementsOverlap,
  getUpdatedChampionChallengerNodes,
  getUpdatedDecisionTableNodes,
  isTargetNode,
  updateEdges
} from '../utils/workflowElementsUtils';
import {
  CUSTOM_FLOW_EVENT_DELETE,
  CUSTOM_FLOW_EVENT_RENAME,
  CUSTOM_FLOW_EVENT_DUPLICATE,
  DEFAULT_SOURCE_HANDLE
} from '../constants';
import { AutoLayoutButton } from '../AutoLayoutButton';
import { getLayoutedElements } from '../utils/workflowLayoutUtils';

import LeavePageConfirmationDialog from '@components/shared/Confirmation/LeavePageConfirmationDialog';
import { FlowNode, IFlow } from '@domain/flow';
import { useActiveStep } from '@contexts/StepContext';
import useFlowChartContextMenu from '@hooks/useFlowChartContextMenu';
import StepActionsMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectUserInfo } from '@store/auth';
import { getFullUserName, isDeleteKeyCodes } from '@utils/helpers';
import { deleteNodes } from '@store/flow';
import { useIsDirty } from '@contexts/IsDirtyContext';
import { theme } from '@theme';
import { KEY_CODES } from '@constants/common';

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
    const [startDrag, setStartDrag] = useState(false);
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
      [flow.id, nodes]
    );

    const handleDuplicate = useCallback(
      (e: CustomEvent<{ subFlowId: string; newNode: FlowNode }>) => {
        const { newNode, subFlowId } = e.detail;
        if (subFlowId === flow.id) {
          setNodes([...nodes, newNode]);
          addNodeAndSyncMainFlow?.(subFlowId, newNode, edges);
        }
      },
      [flow.id, nodes]
    );

    useEffect(() => {
      document.addEventListener(CUSTOM_FLOW_EVENT_DELETE, handleDeleteElements);

      return () => {
        document.removeEventListener(
          CUSTOM_FLOW_EVENT_DELETE,
          handleDeleteElements
        );
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
      document.addEventListener(CUSTOM_FLOW_EVENT_DUPLICATE, handleDuplicate);

      return () => {
        document.removeEventListener(
          CUSTOM_FLOW_EVENT_DUPLICATE,
          handleDuplicate
        );
      };
    }, [handleDuplicate]);

    useEffect(() => {
      if (mainFlow && newNode) {
        addNodeAndSyncMainFlow?.(flow.id, newNode, edges);
        setNewNode(null);
      }
    }, [newNode]);

    const onAddNodeBetweenEdges = useCallback(
      (
        type: StepType,
        name: string,
        edgeId: string,
        nodePosition: XYPosition
      ) => {
        const newEdgeId = uuidv4();
        const username = getFullUserName(user);
        const newNode = createNewNode(
          type,
          name,
          username,
          newEdgeId,
          nodePosition
        );

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
        return { newNode, subFlowId: mainFlow ? flow.id : null };
      },
      [setNodes, setEdges, flow.id]
    );

    const initialElements = useMemo(() => {
      const edges = flow.edges.map((edge) => ({
        ...edge,
        type: isViewMode ? DEFAULT_EDGE_TYPE : ADD_BUTTON_ON_EDGE,
        data: { onAdd: onAddNodeBetweenEdges },
        style: isViewMode
          ? {
              stroke: theme.palette.text.secondary,
              strokeWidth: 1
            }
          : {}
      }));

      return { edges, nodes: flow.nodes };
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

    const debounceCheckIsDirty = useCallback(_.debounce(checkIsDirty, 300), []);

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

    const handleAutoLayout = useCallback(() => {
      const layouted = getLayoutedElements(nodes, edges);
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
    }, [nodes, edges]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        const { key, target } = event;

        if (!isDeleteKeyCodes(key)) return;

        if (rfInstance && isTargetNode(target, rfInstance)) {
          event.stopPropagation();
        }
      },
      [rfInstance]
    );

    const handleReconnect = useCallback(
      (oldEdge: Edge<EdgeData>, newConnection: Connection) => {
        setEdges((els) => {
          const updatedEdges = updateEdge(oldEdge, newConnection, els);
          const edgesDiff = differenceBy(updatedEdges, els, 'id');
          const newEdge = edgesDiff?.[0];

          // If source node still connected - we have to update data for decision table and champion challenger
          if (newEdge && oldEdge.source === newConnection.source) {
            const sourceNode = rfInstance?.getNode(newConnection.source);

            if (sourceNode) {
              switch (sourceNode.type) {
                case StepType.CHAMPION_CHALLENGER: {
                  const updatedNodes = getUpdatedChampionChallengerNodes({
                    nodes,
                    updatedNode: sourceNode,
                    newEdgeId: newEdge.id,
                    sourceHandle: oldEdge.sourceHandle || DEFAULT_SOURCE_HANDLE
                  });
                  setNodes(updatedNodes);
                  break;
                }
                case StepType.DECISION_TABLE: {
                  const updatedNodes = getUpdatedDecisionTableNodes({
                    nodes,
                    updatedNode: sourceNode,
                    newEdgeId: newEdge.id,
                    sourceHandle: oldEdge.sourceHandle || DEFAULT_SOURCE_HANDLE
                  });
                  setNodes(updatedNodes);
                  break;
                }
              }
            }
          }

          return updatedEdges;
        });
      },
      [rfInstance, nodes]
    );

    return (
      <>
        <ReactFlow
          id={flow.id}
          key={flow.id}
          data-flow-id={flow.id}
          nodes={nodes}
          edges={edges}
          autoPanOnNodeDrag
          onKeyDown={handleKeyDown}
          onNodesDelete={isViewMode ? undefined : onNodesDelete}
          onNodesChange={isViewMode ? undefined : onNodesChange}
          onEdgesChange={isViewMode ? undefined : onEdgesChange}
          onConnect={isViewMode ? undefined : onConnect}
          onEdgeUpdate={isViewMode ? undefined : handleReconnect}
          nodesConnectable={!isViewMode}
          onPaneClick={onPaneClick}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDragStop={onNodeDragStop}
          onEdgesDelete={isViewMode ? undefined : onEdgesDelete}
          onNodeDragStart={onNodeDragStart}
          onNodeDoubleClick={onNodeDoubleClick}
          onInit={(instance) => {
            setRfInstance({
              ...instance,
              onAddNodeBetweenEdges
            });
          }}
          deleteKeyCode={[KEY_CODES.Backspace, KEY_CODES.Delete]}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          attributionPosition="bottom-left"
          connectionMode={ConnectionMode.Loose}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={connectionLineStyle}
        >
          <Background variant={BackgroundVariant.Dots} />
          {!isViewMode && <AutoLayoutButton onClick={handleAutoLayout} />}
          <Controls showInteractive={false} />
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
