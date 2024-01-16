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
  ReactFlowInstance,
  useReactFlow,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Edge
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce';
import 'reactflow/dist/style.css';

import FlowHeader from '../../FlowHeader';
import { nodeTypes } from '../Nodes';
import { edgeTypes } from '../Edges';
import NodePositioning from '../Nodes/NodePositioning';
import '../overview.css';
import { ADD_BUTTON_ON_EDGE, EdgeData, StepType } from '../types';
import ControlPanelEdit from '../ContolPanels/ControlPanelEdit';
import {
  checkIfNodeHasConnection,
  checkIfNodeIsInitial,
  createNewNode,
  elementsOverlap
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

interface FlowChartViewProps {
  flow: IFlow;
  setFlow: (flow: IFlow) => void;
}

const FlowChartEditorLayout: React.FC<FlowChartViewProps> = ({
  flow,
  setFlow
}) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const [startDrag, setStartDrag] = useState<boolean>(false);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { step, setStep } = useStep();

  const { setViewport } = useReactFlow();

  const onAddNodeBetweenEdges = useCallback(
    (type: StepType, name: string, edgeId: string) => {
      const newNode = createNewNode(type, name);
      const newEdgeId = uuidv4();

      setNodes((nodes) => nodes.concat(newNode));

      setEdges((eds) => {
        const targetEdgeIndex = eds.findIndex((ed) => ed.id === edgeId);
        const targetEdge = eds[targetEdgeIndex];
        const { target: targetNodeId } = targetEdge;

        const updatedTargetEdge = { ...targetEdge, target: newNode.id };

        const updatedEdges = [...eds];
        updatedEdges[targetEdgeIndex] = updatedTargetEdge;

        const newEdge = {
          id: newEdgeId,
          source: newNode.id,
          target: targetNodeId,
          type: ADD_BUTTON_ON_EDGE,
          data: { onAdd: onAddNodeBetweenEdges }
        };

        return updatedEdges.concat(newEdge);
      });

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
    if (
      initialEdges.length !== edges.length ||
      initialNodes.length !== nodes.length
    ) {
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
      if (connection.source === connection.target) {
        return;
      }
      return setEdges((eds) =>
        addEdge(
          {
            ...connection,
            id: uuidv4(),
            data: { onAdd: onAddNodeBetweenEdges },
            type: ADD_BUTTON_ON_EDGE
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: uuidv4(),
              source,
              target,
              data: { onAdd: onAddNodeBetweenEdges },
              type: ADD_BUTTON_ON_EDGE
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
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
    (updatedNode: Node, edgeId: string) => {
      const newEdgeId = uuidv4();
      setEdges((eds) => {
        const targetEdgeIndex = eds.findIndex((ed) => ed.id === edgeId);
        const targetEdge = eds[targetEdgeIndex];
        const { target: targetNodeId } = targetEdge;

        const updatedTargetEdge = { ...targetEdge, target: updatedNode.id };

        const updatedEdges = [...eds];
        updatedEdges[targetEdgeIndex] = updatedTargetEdge;

        const newEdge = {
          id: newEdgeId,
          source: updatedNode.id,
          target: targetNodeId,
          type: ADD_BUTTON_ON_EDGE,
          data: { onAdd: onAddNodeBetweenEdges }
        };

        return updatedEdges.concat(newEdge);
      });
    },
    [setNodes, setEdges]
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
          onNodeDragStop={onNodeDragStop}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodesDelete={onNodesDelete}
          onNodeDragStart={onNodeDragStart}
          onInit={setRfInstance}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          attributionPosition="bottom-left"
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background variant={BackgroundVariant.Lines} />
          <ControlPanelEdit
            flow={flow}
            setFlow={setFlow}
            rfInstance={rfInstance}
          />
        </ReactFlow>
        {step.id !== MAIN_STEP_ID && (
          <StepConfigureView step={step as FlowNode} />
        )}
      </MainContainer>
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
