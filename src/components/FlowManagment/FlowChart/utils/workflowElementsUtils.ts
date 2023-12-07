import { v4 as uuidv4 } from 'uuid';
import { Node, Edge } from 'reactflow';
import _ from 'lodash';

import { ObjectType } from '../types';

import Logger from '@utils/logger';

const defaultPosition = { x: 0, y: 0 };

// type Elements = {
//   nodes: Node[];
//   edges: Edge[];
//   targetEdgeId: string;
//   type?: string;
//   onAddNodeCallback: (id: string) => void;
//   position?: { x: number; y: number };
// };

// export const getUpdatedElementsAfterNodeAddition = ({
//   nodes,
//   edges,
//   targetEdgeId,
//   type = 'default',
//   onAddNodeCallback,
//   position = defaultPosition
// }: Elements) => {
//   const newNodeId = uuidv4();
//   const newEdgeId = uuidv4();

//   const newNode: Node = {
//     id: newNodeId,
//     type,
//     position,
//     data: {}
//   };

//   const clonedNodes = _.cloneDeep(nodes);
//   const clonedEdges = _.cloneDeep(edges);

//   const targetEdgeIndex = clonedEdges.findIndex((ed) => ed.id === targetEdgeId);
//   const targetEdge = clonedEdges[targetEdgeIndex];

//   if (targetEdge) {
//     const { target: targetNodeId } = targetEdge;

//     const updatedTargetEdge = { ...targetEdge, target: newNodeId };

//     const updatedEdges = [...clonedEdges];
//     updatedEdges[targetEdgeIndex] = updatedTargetEdge;

//     // Add new Node
//     const testNodes = clonedNodes.concat(newNode);

//     // Create new edge
//     const newEdge = {
//       id: newEdgeId,
//       source: newNodeId,
//       target: targetNodeId,
//       type: 'add',
//       data: { onAddNode: onAddNodeCallback }
//     };

//     // Add new edge
//     const testEdges = updatedEdges.concat(newEdge);

//     return { nodes: testNodes, edges: testEdges };
//   }
// };

type Elements = {
  elements: Array<Node | Edge>;
  targetEdgeId: string;
  onAddNodeCallback: ({ id, type }: { id: string; type: ObjectType }) => void;
  type: ObjectType;
  position?: { x: number; y: number };
};

export const getUpdatedElementsAfterNodeAddition = ({
  elements,
  targetEdgeId,
  type,
  position = defaultPosition,
  onAddNodeCallback
}: Elements) => {
  const newNodeId = uuidv4();
  const newEdgeId = uuidv4();

  Logger.info('onNode add', type);

  const newNode = {
    id: newNodeId,
    type,
    data: {},
    position
  };
  const clonedElements = _.cloneDeep(elements);

  const targetEdgeIndex = clonedElements.findIndex(
    (x) =>
      // console.log('targetEdgeId', targetEdgeId);
      x.id === targetEdgeId
  );
  const targetEdge = elements[targetEdgeIndex];

  if (targetEdge) {
    const { target: targetNodeId } = targetEdge;
    const updatedTargetEdge = { ...targetEdge, target: newNodeId };
    clonedElements[targetEdgeIndex] = updatedTargetEdge;
    clonedElements.push(newNode);

    const newEdge = {
      id: newEdgeId,
      source: newNodeId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      target: targetNodeId,
      type: 'add',
      data: { onAddNodeCallback }
    };

    clonedElements.push(newEdge);

    return clonedElements;
  } else {
    // Handle the case when targetEdge is undefined
    Logger.error('Target edge is undefined.');
    return elements; // Return the original elements array
  }
};
