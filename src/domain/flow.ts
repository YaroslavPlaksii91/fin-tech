import { Edge, Node, Viewport } from '@reactflow/core';

import { IEntity } from './entity';

import { StepType } from '@components/FlowManagment/FlowChart/types';

export interface IFlowListItem extends IEntity {
  name: string;
}

export type FlowData = {
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  editedBy: string;
  editedOn: string;
};

export type NodeData = {
  $type: StepType;
  stepId: string;
  stepType: StepType;
  name: string;
  tag?: string;
  note?: string | null;
};

export type ChampionChallengerData = {
  splits?: { edgeId: string; percentage: number }[];
};

export type FlowNode = Node<NodeData & ChampionChallengerData>;

export interface IFlow {
  id: string;
  nodes: FlowNode[];
  edges: Edge[];
  viewport: Viewport;
  data: Omit<FlowData, 'id'>;
}

type FlowDataCreate = Pick<FlowData, 'name' | 'createdBy' | 'editedBy'>;

export type IFlowDataCreate = Omit<IFlow, 'id' | 'data'> & {
  data: FlowDataCreate;
};
