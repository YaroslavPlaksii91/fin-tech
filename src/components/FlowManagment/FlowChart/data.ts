import { Node, Edge } from 'reactflow';
const position = { x: 0, y: 0 };

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

export const initialEdges: Edge[] = [
  { id: 'e12', source: '1', target: '2', type: 'add' }
  // { id: 'e13', source: '1', target: '3', type: 'add', animated: true },
  // { id: 'e22a', source: '2', target: '2a', type: 'add', animated: true },
  // { id: 'e22b', source: '2', target: '2b', type: 'add', animated: true },
  // { id: 'e22c', source: '2', target: '2c', type: 'add', animated: true },
  // { id: 'e2c2d', source: '2c', target: '2d', type: 'add', animated: true }
];

export const initialNodes2 = [
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
];

export const initialEdges2 = [
  { id: 'e1-2', source: '1', target: '2', type: 'add' }
];

// const initialNodes = [
//   {
//     id: '1',
//     type: 'input',
//     data: { label: 'Start here...' },
//     position: { x: -150, y: 0 }
//   },
//   {
//     id: '2',
//     type: 'input',
//     data: { label: '...or here!' },
//     position: { x: 150, y: 0 }
//   },
//   { id: '3', data: { label: 'Delete me.' }, position: { x: 0, y: 100 } },
//   { id: '4', data: { label: 'Then me!' }, position: { x: 0, y: 200 } },
//   {
//     id: '5',
//     type: 'output',
//     data: { label: 'End here!' },
//     position: { x: 0, y: 300 }
//   }
// ];

// const initialEdges = [
//   { id: '1->3', source: '1', target: '3' },
//   { id: '2->3', source: '2', target: '3' },
//   { id: '3->4', source: '3', target: '4' },
//   { id: '4->5', source: '4', target: '5' }
// ];
