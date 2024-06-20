import * as yup from 'yup';

import { createInitialFlow } from './initialFlowUtils';

import { IFlowDataCreate } from '@domain/flow';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Flow name is required')
    .max(30, 'Flow name cannot have more than 30 characters')
});

export const createInitialFlowDataHelper = (
  name: string,
  username: string
): IFlowDataCreate => {
  const { nodes, edges, viewport } = createInitialFlow();

  return {
    data: {
      name,
      createdBy: username,
      editedBy: username
    },
    nodes,
    edges,
    viewport,
    temporaryVariables: [],
    permanentVariables: []
  };
};

export default validationSchema;
