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
    deletable: true,
    draggable: true
  };

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
