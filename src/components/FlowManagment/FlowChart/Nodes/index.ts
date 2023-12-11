import { NodeTypes } from 'reactflow';

import { ObjectType } from '../types';

import * as InitialNodes from './InitialNodes';
import RectangleNode from './RectangleNode';
import ListNode from './ListNode';

export const nodeTypes: NodeTypes = {
  start: InitialNodes.StartNode,
  end: InitialNodes.EndNode,
  [ObjectType.CALCULATION]: RectangleNode,
  [ObjectType.CHAMPION_CHALLENGER]: ListNode
};
