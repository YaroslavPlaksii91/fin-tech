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
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

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
import {
  checkIfFlowIsEdit,
  checkIfNodeHasConnection,
  checkIfNodeIsInitial,
  createNewNode,
  elementsOverlap,
  getUpdatedChampionChallengerNodes,
  updateEdges
} from '../utils/workflowElementsUtils';
import { getLayoutedElements } from '../utils/workflowLayoutUtils';
import { DEFAULT_SOURCE_HANDLE } from '../constants';

import LeavePageConfirmationDialog from '@components/shared/Confirmation/LeavePageConfirmationDialog.tsx';
import { FlowNode, IFlow } from '@domain/flow';
import { useActiveStep } from '@contexts/StepContext';
import useFlowChartContextMenu from '@hooks/useFlowChartContextMenu';
import StepActionsMenu from '@components/StepManagment/StepActionsMenu/StepActionsMenu';
import { addNode, deleteNodes } from '@store/flow/flow';
import { useAppDispatch } from '@store/hooks';

type FlowChartEditorProps = {
  flow: IFlow;
  mainFlow: IFlow;
  setCopyFlow: (flow: IFlow) => void;
  updateNodesInMainFlow: (newNode: IFlow, subFlow: IFlow) => void;
};

const withFlowChartEditor =
  (StepConfigureView, ControlPanel) =>
  // eslint-disable-next-line react/display-name
  (props: FlowChartEditorProps) => {
    const { flow, mainFlow, setCopyFlow } = props;
    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [rfInstance, setRfInstance] = useState<CustomReactFlowInstance>();
    const [startDrag, setStartDrag] = useState<boolean>(false);
    const { flowNode, nodeElement, onPaneClick, onNodeContextMenu } =
      useFlowChartContextMenu();

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const dispatch = useAppDispatch();

    const { setViewport } = useReactFlow();

    const { activeStep, setActiveStep } = useActiveStep();

    const onAddNodeBetweenEdges = useCallback(
      (type: StepType, name: string, edgeId: string) => {
        const newEdgeId = uuidv4();
        const newNode = createNewNode(type, name, newEdgeId);

        setNodes((nodes) => nodes.concat(newNode));
        dispatch(addNode({ node: cloneDeep(newNode), flowId: flow.id }));

        props?.updateNodesInMainFlow(newNode, flow);

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
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(flow.nodes, flow.edges);
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
        const newEdgeId = uuidv4();
        if (connection.source === connection.target) {
          return;
        }

        // Update edgeId of splits Champion Challenger data
        if (rfInstance && connection.source) {
          const updatedNode = rfInstance.getNode(connection.source) as FlowNode;
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
        // Update edgeId of splits Champion Challenger data
        if (
          updatedNode &&
          updatedNode.type === StepType.CHAMPION_CHALLENGER &&
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

    const onNodesDelete = useCallback((deletedNodes: Node[]) => {
      dispatch(deleteNodes({ deletedNodes, flowId: flow.id }));
    }, []);

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
          onNodesDelete={onNodesDelete}
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
          <Background variant={BackgroundVariant.Dots} />
          <ControlPanel
            flow={flow}
            setCopyFlow={setCopyFlow}
            isDirty={isDirty}
            rfInstance={rfInstance}
          />
          <Controls />
        </ReactFlow>
        <StepConfigureView
          mainFlow={mainFlow}
          flow={flow}
          rfInstance={rfInstance}
        />
        <StepActionsMenu
          activeStep={activeStep}
          anchorElement={nodeElement}
          flowNode={flowNode}
          isOpen={Boolean(flowNode)}
          onClose={onPaneClick}
          isEditMode
          setActiveStep={setActiveStep}
        />
        <LeavePageConfirmationDialog isDirty={isDirty} />
      </>
    );
  };
export default withFlowChartEditor;
