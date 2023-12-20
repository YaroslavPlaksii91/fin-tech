import { v4 as uuidv4 } from 'uuid';
import { Node, Edge, isNode } from 'reactflow';
import { cloneDeep } from 'lodash';

import { ADD_BUTTON_ON_EDGE, EdgeData, ObjectType } from '../types';

import Logger from '@utils/logger';
import { DRAWER_WIDTH, HEADER_HEIGHT } from '@constants/themeConstants';

const defaultPosition = { x: 0, y: 0 };

type Elements = {
  elements: Array<Node | Edge<EdgeData>>;
  targetEdgeId: string;
  onAdd: ({ id, type }: { id: string; type: ObjectType }) => void;
  type: ObjectType;
  position?: { x: number; y: number };
};

export const getUpdatedElementsAfterNodeAddition = ({
  elements,
  targetEdgeId,
  type,
  position = defaultPosition,
  onAdd
}: Elements) => {
  const newNodeId = uuidv4();
  const newEdgeId = uuidv4();

  const newNode = {
    id: newNodeId,
    type,
    data: {},
    position
  };
  const clonedElements = cloneDeep(elements);

  const targetEdgeIndex = clonedElements.findIndex(
    (x) => x.id === targetEdgeId
  );
  const targetEdge = elements[targetEdgeIndex] as Edge<EdgeData>;

  if (targetEdge) {
    const { target: targetNodeId } = targetEdge;
    const updatedTargetEdge = { ...targetEdge, target: newNodeId };
    clonedElements[targetEdgeIndex] = updatedTargetEdge;
    clonedElements.push(newNode);

    const newEdge = {
      id: newEdgeId,
      source: newNodeId,
      target: targetNodeId,
      type: ADD_BUTTON_ON_EDGE,
      data: { onAdd }
    };

    clonedElements.push(newEdge);

    return clonedElements;
  } else {
    Logger.error('Target edge is undefined.');
    return elements;
  }
};

export const getNodes = (elements: (Node | Edge)[]): Node[] =>
  elements.filter<Node>((el): el is Node => !!isNode(el));

export const getEdges = (elements: (Node | Edge)[]): Edge[] =>
  elements.filter<Edge>((el): el is Edge => !isNode(el));

export const areOnlyStartAndEndObjects = (nodes: Node[]) => {
  for (let i = 0; i < nodes.length; i++) {
    const nodeType = nodes[i].type;
    if (!(nodeType === 'StartObject' || nodeType === 'EndObject')) {
      return false;
    }
  }
  return true;
};

export const centeredInitialFlowViewport = () => {
  const x = (window.innerWidth - 2 * DRAWER_WIDTH) / 2;
  const y = (window.innerHeight - HEADER_HEIGHT) / 2;
  return { x, y, zoom: 1 };
};
