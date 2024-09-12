import { v4 as uuidv4 } from 'uuid';

import { StepType } from '@components/FlowManagment/FlowChart/types';
import { FlowNode } from '@domain/flow';

export const getDuplicatedNode = (node: FlowNode, nodeName: string) => {
  let data;

  // Remove all edges that might be inside step
  switch (node.data.$type) {
    case StepType.DECISION_TABLE: {
      data = {
        ...node.data,
        defaultEdgeId: null,
        caseEntries: node.data?.caseEntries?.map((caseEntry) => ({
          ...caseEntry,
          edgeId: null
        }))
      };
      break;
    }
    case StepType.CALCULATION: {
      data = {
        ...node.data,
        splits: node.data?.splits?.map((split) => ({
          ...split,
          edgeId: null
        }))
      };
      break;
    }
    default:
      data = node.data;
  }

  const id = uuidv4();

  const duplicatedNode = {
    ...node,
    id,
    data: { ...data, stepId: id, name: nodeName }
  };

  return duplicatedNode;
};
