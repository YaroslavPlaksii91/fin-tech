import { v4 as uuidv4 } from 'uuid';

import { ADD_BUTTON_ON_EDGE, ObjectType } from '../FlowChart/types';

import { FlowNode } from '@domain/flow';

const startNodeId = uuidv4();
const endNodeId = uuidv4();

export const createStartNodeData = () => {
  const newNode: FlowNode = {
    id: startNodeId,
    type: ObjectType.START,
    data: {
      $type: ObjectType.START,
      objectId: startNodeId,
      objectType: ObjectType.START,
      name: ObjectType.START
    },
    width: 40,
    height: 40,
    position: { x: 0, y: 0 }
  };
  return newNode;
};

export const createEndNodeData = () => {
  const newNode: FlowNode = {
    id: endNodeId,
    type: ObjectType.END,
    data: {
      $type: ObjectType.END,
      objectId: endNodeId,
      objectType: ObjectType.END,
      name: ObjectType.END
    },
    width: 40,
    height: 40,
    position: { x: 0, y: 0 }
  };
  return newNode;
};

export const createEdgeData = () => {
  const newEdgeId = uuidv4();
  const newEdge = {
    id: newEdgeId,
    type: ADD_BUTTON_ON_EDGE,
    source: startNodeId,
    target: endNodeId
  };

  return newEdge;
};
