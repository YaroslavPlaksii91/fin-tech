import { v4 as uuidv4 } from 'uuid';
import { Edge, Node } from 'reactflow';
import pick from 'lodash/pick';

import { ADD_BUTTON_ON_EDGE, StepType } from '../types';

import { FlowNode } from '@domain/flow';
import { createInitialFlow } from '@components/FlowManagment/AddFlow/initialFlowUtils';

interface GetUpdatedNodes {
  nodes: FlowNode[];
  updatedNode: FlowNode;
  newEdgeId: string | null;
  sourceHandle: string;
}

const defaultPosition = { x: 0, y: 0 };

export const createNewNode = (
  type: StepType,
  name: string,
  edgeId?: string
): FlowNode => {
  const newNodeId = uuidv4();
  const newNode: FlowNode = {
    id: newNodeId,
    type,
    data: {
      $type: type,
      stepId: newNodeId,
      stepType: type,
      name
    },
    position: defaultPosition,
    deletable: true,
    draggable: true
  };

  switch (type) {
    case StepType.CHAMPION_CHALLENGER:
      if (edgeId) {
        newNode.data = {
          ...newNode.data,
          splits: [{ edgeId, percentage: 100 }]
        };
      } else {
        newNode.data = { ...newNode.data, splits: [] };
      }
      break;
    case StepType.DECISION_TABLE:
      newNode.data = {
        ...newNode.data,
        caseEntries: [{ conditions: [], actions: [] }],
        defaultActions: [],
        variableSources: [],
        defaultEdgeId: null
      };
      break;
    case StepType.CALCULATION:
      newNode.data = { ...newNode.data, expressions: [] };
      break;
    case StepType.SUBFLOW: {
      const { nodes, edges, viewport } = createInitialFlow();
      newNode.data = { ...newNode.data, nodes, edges, viewport };
      break;
    }
    default:
      break;
  }

  return newNode;
};

export const elementsOverlap = (el1: HTMLElement, el2: Element) => {
  const domRect1 = el1.getBoundingClientRect();
  const domRect2 = el2.getBoundingClientRect();

  return !(
    domRect1.top > domRect2.bottom ||
    domRect1.right < domRect2.left ||
    domRect1.bottom < domRect2.top ||
    domRect1.left > domRect2.right
  );
};

export const checkIfNodeHasConnection = (edges: Edge[], nodeId: string) =>
  !!edges.find((edge) => edge.source === nodeId || edge.target === nodeId);

export const checkIfNodeIsInitial = (node: FlowNode) =>
  node.type === StepType.START || node.type === StepType.END;

type updateEdgesParams = {
  edges: Edge[];
  updatableEdgeId: string;
  newNodeId: string;
  newEdgeId: string;
  sourceHandle?: string | null;
  onAddNodeBetweenEdges: (
    type: StepType,
    name: string,
    edgeId: string
  ) => { newNode: FlowNode; flowId: string };
};

export const updateEdges = ({
  edges,
  updatableEdgeId,
  newNodeId,
  newEdgeId,
  sourceHandle = null,
  onAddNodeBetweenEdges
}: updateEdgesParams) => {
  const targetEdgeIndex = edges.findIndex((ed) => ed.id === updatableEdgeId);

  const targetEdge = edges[targetEdgeIndex];
  const { target: targetNodeId } = targetEdge;

  const updatedTargetEdge = { ...targetEdge, target: newNodeId };

  const updatedEdges = [...edges];
  updatedEdges[targetEdgeIndex] = updatedTargetEdge;

  const newEdge = {
    id: newEdgeId,
    source: newNodeId,
    sourceHandle,
    target: targetNodeId,
    type: ADD_BUTTON_ON_EDGE,
    data: { onAdd: onAddNodeBetweenEdges }
  };

  return updatedEdges.concat(newEdge);
};

export const checkIfFlowIsEdit = ({
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
  const formattedInitialEdges = initialEdges.map((edg) =>
    pick(edg, ['source', 'target', 'sourceHandle'])
  );
  const formattedOutputEdges = edges.map((edg) =>
    pick(edg, ['source', 'target', 'sourceHandle'])
  );
  const isEditEdges =
    JSON.stringify(formattedInitialEdges) !==
    JSON.stringify(formattedOutputEdges);

  const formattedInitialNodes = initialNodes.map((node) =>
    pick(node, ['data'])
  );
  const formatteOutputdNodes = nodes.map((node) => pick(node, ['data']));
  const isEditNodes =
    JSON.stringify(formattedInitialNodes) !==
    JSON.stringify(formatteOutputdNodes);

  return isEditEdges || isEditNodes;
};

export const getUpdatedChampionChallengerNodes = ({
  nodes,
  updatedNode,
  newEdgeId,
  sourceHandle
}: GetUpdatedNodes) => {
  const updatedSplits =
    updatedNode.data.splits?.map((split, index) => {
      if (index === +sourceHandle) return { ...split, edgeId: newEdgeId };

      return { ...split };
    }) ?? [];

  const updatedNodes = nodes.map((node) => {
    if (node.id === updatedNode?.id) node.data.splits = [...updatedSplits];
    return node;
  });

  return updatedNodes;
};

export const getUpdatedDecisionTableNodes = ({
  nodes,
  updatedNode,
  newEdgeId,
  sourceHandle
}: GetUpdatedNodes) => {
  const updatedCaseEntries =
    updatedNode.data.caseEntries?.map((entry, index) => {
      if (index === +sourceHandle) return { ...entry, edgeId: newEdgeId };

      return { ...entry };
    }) ?? [];

  const isDefaultEdgeId = updatedCaseEntries.length === +sourceHandle;

  const updatedNodes = nodes.map((node) => {
    const isNodeToUpdate = node.id === updatedNode?.id;

    if (isNodeToUpdate) node.data.caseEntries = [...updatedCaseEntries];
    if (isNodeToUpdate && isDefaultEdgeId) node.data.defaultEdgeId = newEdgeId;

    return node;
  });

  return updatedNodes;
};
