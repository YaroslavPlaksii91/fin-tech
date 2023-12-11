import { Edge, Node, Viewport } from '@reactflow/core';

import { IEntity } from '../entity';

export interface IFlow extends IEntity {
  name: string;
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}
