import { Edge, Node, Viewport } from '@reactflow/core';

import { IEntity } from './entity';

import { ObjectType } from '@components/FlowManagment/FlowChart/types';

export interface IFlowListItem extends IEntity {
  name: string;
}

type FlowData = {
  name: string;
  id?: string;
  createdBy?: string;
  createdOn?: string;
  editedBy?: string;
  editedOn?: string;
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
  nodes: FlowNode[];
  edges: Edge[];
  viewport: Viewport;
  data: FlowData;
  id?: string;
}
