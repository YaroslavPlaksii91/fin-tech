import * as yup from 'yup';

import { createInitialFlow } from './initialFlowUtils';

import { IFlowDataCreate } from '@domain/flow';
import {
  PERMANENT_VARIABLES_MOCK,
  TEMPORARY_VARIABLES_MOCK
} from '@constants/mocks';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Flow name is required')
    .max(30, 'Flow name cannot have more than 30 characters')
});

export const createInitialFlowDataHelper = (name: string): IFlowDataCreate => {
  const username = 'username';
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
    temporaryVariables: TEMPORARY_VARIABLES_MOCK,
    permanentVariables: PERMANENT_VARIABLES_MOCK
  };
};

export default validationSchema;
