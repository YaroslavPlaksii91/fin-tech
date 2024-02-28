import { CustomReactFlowInstance, DEFAULT_EDGE_TYPE } from '../types';

import { IFlow } from '@domain/flow';

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
    viewport: flowInstance.viewport,
    temporaryVariables: [
      {
        variableDataType: 'Integer',
        variableName: 'wTemp1',
        variableValue: '0'
      },
      {
        variableDataType: 'Boolean',
        variableName: 'wTemp2',
        variableValue: 'true'
      }
    ]
  };
};
