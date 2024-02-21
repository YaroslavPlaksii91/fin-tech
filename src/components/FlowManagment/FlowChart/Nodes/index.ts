import { NodeTypes } from 'reactflow';

import { StepType } from '../types';

import * as InitialNodes from './InitialNodes';
import RectangleNode from './RectangleNode';
import ListNode from './ListNode';

export const nodeTypes: NodeTypes = {
  [StepType.START]: InitialNodes.StartNode,
  [StepType.END]: InitialNodes.EndNode,
  [StepType.DECISION_TABLE]: RectangleNode,
  [StepType.CHAMPION_CHALLENGER]: ListNode,
  [StepType.CALCULATION]: RectangleNode
};
