import { v4 as uuidv4 } from 'uuid';

import { StepType } from '../types';

import { FlowNode } from '@domain/flow';

const defaultPosition = { x: 0, y: 0 };

export const createNewNode = (type: StepType, name: string): FlowNode => {
  const newEdgeId = uuidv4();
  const newNodeId = uuidv4();
  const newNode = {
    id: newNodeId,
    type,
    data: {
      $type: type,
      stepId: newNodeId,
      stepType: type,
      name,
      splits: [
        {
          edgeId: newEdgeId,
          percentage: 100
        }
      ]
    },
    position: defaultPosition,
    deletable: true
  };

  return newNode;
};
