import * as yup from 'yup';

import {
  createEdgeData,
  createEndNodeData,
  createStartNodeData,
  getViewPort
} from './initialFlowUtils';

import { IFlowDataCreate } from '@domain/flow';
import Auth from '@utils/auth';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('flow name is required')
    .max(30, 'Flow name cannot have more than 30 characters')
});

export const createInitialFlowDataHelper = (name: string): IFlowDataCreate => {
  const startNodeData = createStartNodeData();
  const endNodeData = createEndNodeData();
  const edgeData = createEdgeData();
  const username = Auth.getUsername();
  const viewport = getViewPort();

  return {
    data: {
      name,
      createdBy: username,
      editedBy: username
    },
    nodes: [startNodeData, endNodeData],
    edges: [edgeData],
    viewport
  };
};

export default validationSchema;
