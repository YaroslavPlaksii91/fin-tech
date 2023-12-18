import { Edge, Node, Viewport } from '@reactflow/core';

import { IEntity } from './entity';

import { ObjectType } from '@components/FlowManagment/FlowChart/types';

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

type NodeData = {
  $type: ObjectType;
  objectId: string;
  objectType: ObjectType;
  name: string;
  tag?: string;
};

export type FlowNode = Node<NodeData>;

export interface IFlowData {
  id: string;
  nodes: FlowNode[];
  edges: Edge[];
  viewport: Viewport;
  data: FlowData;
}

type FlowDataCreate = Pick<FlowData, 'name' | 'createdBy' | 'editedBy'>;

export type IFlowDataCreate = Omit<IFlowData, 'id' | 'data'> & {
  data: FlowDataCreate;
};
