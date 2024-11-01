import { AxiosError } from 'axios';
import * as _ from 'lodash-es';

import { CustomReactFlowInstance, DEFAULT_EDGE_TYPE } from '../types';

import { GENERAL_SERVER_ERROR } from '@constants/common';
import { FlowNode, IFlow } from '@domain/flow';

type inputData = {
  flow: IFlow;
  rfInstance: CustomReactFlowInstance;
};

export const formatFlowOnSave = ({ flow, rfInstance }: inputData): IFlow => {
  const flowInstance = rfInstance.toObject();
  return {
    ...flow,
    edges: flowInstance.edges.map((edge) => ({
      ...edge,
      type: DEFAULT_EDGE_TYPE
    })),
    nodes: flowInstance.nodes,
    viewport: flowInstance.viewport
  };
};

export const isFlowChanged = ({ flow, rfInstance }: inputData) => {
  const flowInstance = rfInstance.toObject();

  const selectedFlow = {
    viewport: flow.viewport,
    nodes: flow.nodes.map((node) =>
      _.pick(node, ['id', 'data', 'position', 'type'])
    ),
    edges: flow.edges.map((edge) => _.pick(edge, ['id', 'source', 'target']))
  };

  const selectedFlowInstance = {
    viewport: flowInstance.viewport,
    nodes: flowInstance.nodes.map((node) =>
      _.pick(node, ['id', 'data', 'position', 'type'])
    ),
    edges: flowInstance.edges.map((edge) =>
      _.pick(edge, ['id', 'source', 'target'])
    )
  };

  return !_.isEqual(selectedFlow, selectedFlowInstance);
};

const getNodePath = (
  nodes: FlowNode[],
  nodeId: string,
  path: string[] = []
): string | null => {
  for (const node of nodes) {
    const currentPath = [...path, node.data.name];
    if (node.id === nodeId) {
      return currentPath.join('/');
    }
    if (node.data.nodes) {
      const result = getNodePath(node.data.nodes, nodeId, currentPath);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

type ErrorResponse = {
  property: string;
  message: string;
  code: string | null;
  state: {
    nodeId?: string;
    edgesIds?: string[];
  } | null;
};

export const parseFlowValidationErrors = (
  error: unknown,
  nodes: FlowNode[]
): string[] => {
  if (error instanceof AxiosError) {
    if (
      error.response &&
      error.response.data &&
      typeof error.response.data === 'object'
    ) {
      return (error.response.data as ErrorResponse[]).map((error) => {
        const { message, state } = error;
        let additionalInfo = '';

        if (state?.nodeId) {
          const nodePath = getNodePath(nodes, state.nodeId);
          additionalInfo = nodePath ? nodePath : '';
        }

        return `${message} ${additionalInfo.length ? `"${additionalInfo}"` : ''}`;
      });
    } else {
      return [GENERAL_SERVER_ERROR];
    }
  } else {
    return [GENERAL_SERVER_ERROR];
  }
};
