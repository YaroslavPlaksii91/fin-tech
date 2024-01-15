import { ReactFlowInstance } from 'reactflow';

import { DEFAULT_EDGE_TYPE } from '../types';

import { IFlow } from '@domain/flow';

type inputData = {
  flow: IFlow;
  rfInstance: ReactFlowInstance;
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
