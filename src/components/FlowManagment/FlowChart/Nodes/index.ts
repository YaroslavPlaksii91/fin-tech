import { NodeTypes } from 'reactflow';

import { ObjectType } from '../types';

import * as Node from './Nodes';

export const nodeTypes: NodeTypes = {
  start: Node.StartNode,
  end: Node.EndNode,
  test: Node.Calculation,
  [ObjectType.CALCULATION]: Node.Calculation,
  [ObjectType.CONDITION]: Node.Condition,
  [ObjectType.CHAMPION_CHALLENGER]: Node.ChampionChallender
};
