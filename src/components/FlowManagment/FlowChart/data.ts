import { Node, Edge, Position } from 'reactflow';

import { EdgeData } from './types';
const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';
const connectionsPosition = {
  targetPosition: Position.Left,
  sourcePosition: Position.Right
};

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'start',
    data: {},
    position
  },
  {
    id: '2',
    type: 'end',
    data: {},
    position
  }
  // {
  //   id: '3',
  //   type: 'calculation',
  //   data: {},
  //   position: { x: 90, y: 20 }
  // }
  // {
  //   id: '2a',
  //   data: { label: 'node 2a' },
  //   position
  // },
  // {
  //   id: '2b',
  //   data: { label: 'node 2b' },
  //   position
  // },
  // {
  //   id: '2c',
  //   data: { label: 'node 2c' },
  //   position
  // },
  // {
  //   id: '2d',
  //   data: { label: 'node 2d' },
  //   position
  // },
  // {
  //   id: '3',
  //   data: { label: 'node 3' },
  //   position
  // }
];

export const initialEdges: Edge<EdgeData>[] = [
  { id: 'e12', source: '1', target: '2', type: 'add' }
  // { id: 'e32', source: '3', target: '2', type: 'add' }
  // { id: 'e13', source: '1', target: '3', type: 'add', animated: true },
  // { id: 'e22a', source: '2', target: '2a', type: 'add', animated: true },
  // { id: 'e22b', source: '2', target: '2b', type: 'add', animated: true },
  // { id: 'e22c', source: '2', target: '2c', type: 'add', animated: true },
  // { id: 'e2c2d', source: '2c', target: '2d', type: 'add', animated: true }
];

export const initialNodes2: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'input' },
    position,
    ...connectionsPosition
  },
  {
    id: '2',
    data: { label: 'node 2' },
    position,
    ...connectionsPosition
  },
  {
    id: '2a',
    data: { label: 'node 2a' },
    position,
    ...connectionsPosition
  },
  {
    id: '2b',
    data: { label: 'node 2b' },
    position,
    ...connectionsPosition
  },
  {
    id: '2c',
    data: { label: 'node 2c' },
    position,
    ...connectionsPosition
  },
  {
    id: '2d',
    data: { label: 'node 2d' },
    position,
    ...connectionsPosition
  },
  {
    id: '3',
    data: { label: 'node 3' },
    position,
    ...connectionsPosition
  }
];

export const initialEdges2: Edge<EdgeData>[] = [
  { id: 'e12', source: '1', target: '2', type: 'add' },
  { id: 'e13', source: '1', target: '3', type: edgeType },
  { id: 'e22a', source: '2', target: '2a', type: edgeType },
  { id: 'e22b', source: '2', target: '2b', type: edgeType },
  { id: 'e22c', source: '2', target: '2c', type: edgeType },
  { id: 'e2c2d', source: '2c', target: '2d', type: edgeType }
];
