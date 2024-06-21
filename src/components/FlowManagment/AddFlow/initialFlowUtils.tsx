import { v4 as uuidv4 } from 'uuid';

import { DEFAULT_EDGE_TYPE, StepType } from '../FlowChart/types';

import { FlowNode } from '@domain/flow';
import { DRAWER_WIDTH, HEADER_HEIGHT } from '@constants/themeConstants';

export const createInitialFlow = (username: string) => {
  const startNodeId = uuidv4();
  const endNodeId = uuidv4();
  const newEdgeId = uuidv4();

  const x = (window.innerWidth - DRAWER_WIDTH * 3) / 2;
  const y = (window.innerHeight - HEADER_HEIGHT) / 2;

  const viewport = { x, y, zoom: 1 };

  const startNode: FlowNode = {
    id: startNodeId,
    type: StepType.START,
    data: {
      $type: StepType.START,
      stepId: startNodeId,
      stepType: StepType.START,
      name: StepType.START,
      editedBy: username,
      editedOn: new Date().toISOString()
    },
    width: 40,
    height: 40,
    position: { x: 0, y: 0 },
    deletable: false,
    draggable: true
  };

  const endNode: FlowNode = {
    id: endNodeId,
    type: StepType.END,
    data: {
      $type: StepType.END,
      stepId: endNodeId,
      stepType: StepType.END,
      name: StepType.END,
      editedBy: username,
      editedOn: new Date().toISOString()
    },
    width: 40,
    height: 40,
    position: { x: 340, y: 0 },
    deletable: false,
    draggable: true
  };

  const edge = {
    id: newEdgeId,
    source: startNodeId,
    target: endNodeId,
    type: DEFAULT_EDGE_TYPE
  };

  return {
    nodes: [startNode, endNode],
    edges: [edge],
    viewport
  };
};
