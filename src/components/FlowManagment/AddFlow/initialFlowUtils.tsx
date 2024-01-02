import { v4 as uuidv4 } from 'uuid';

import { ADD_BUTTON_ON_EDGE, StepType } from '../FlowChart/types';

import { FlowNode } from '@domain/flow';
import { DRAWER_WIDTH, HEADER_HEIGHT } from '@constants/themeConstants';

const startNodeId = uuidv4();
const endNodeId = uuidv4();

export const createStartNodeData = () => {
  const newNode: FlowNode = {
    id: startNodeId,
    type: StepType.START,
    data: {
      $type: StepType.START,
      stepId: startNodeId,
      stepType: StepType.START,
      name: StepType.START
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
    type: StepType.END,
    data: {
      $type: StepType.END,
      stepId: endNodeId,
      stepType: StepType.END,
      name: StepType.END
    },
    width: 40,
    height: 40,
    position: { x: 340, y: 0 }
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

export const getViewPort = () => {
  const x = (window.innerWidth - DRAWER_WIDTH * 3) / 2;
  const y = (window.innerHeight - HEADER_HEIGHT) / 2;

  return { x, y, zoom: 1 };
};
