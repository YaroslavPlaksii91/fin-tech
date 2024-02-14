import { v4 as uuidv4 } from 'uuid';
import { Edge } from 'reactflow';
import some from 'lodash/some';

import { ADD_BUTTON_ON_EDGE, StepType } from '../types';

import { FlowNode } from '@domain/flow';

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
  onAddNodeBetweenEdges: (
    type: StepType,
    name: string,
    edgeId: string
  ) => FlowNode;
};

export const updateEdges = ({
  edges,
  updatableEdgeId,
  newNodeId,
  newEdgeId,
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
    sourceHandle: '0',
    target: targetNodeId,
    type: ADD_BUTTON_ON_EDGE,
    data: { onAdd: onAddNodeBetweenEdges }
  };

  return updatedEdges.concat(newEdge);
};

export const checkEdgeMultiplicity = (edges: Edge[]) =>
  some(edges, (currentObject, currentIndex) =>
    some(edges, (nextObject, nextIndex) => {
      if (currentIndex !== nextIndex) {
        return (
          currentObject.source === nextObject.source ||
          currentObject.source === nextObject.target ||
          currentObject.target === nextObject.source ||
          currentObject.target === nextObject.target
        );
      }
      return false;
    })
  );
