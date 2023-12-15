import * as yup from 'yup';

import { IFlowData } from '../../../types/domain';

import {
  createEdgeData,
  createEndNodeData,
  createStartNodeData,
  getInitialViewData
} from './initialFlowUtils';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('flow name is required')
    .max(30, 'Flow name cannot have more than 30 characters')
});

export const createInitialFlowDataHelper = (name: string): IFlowData => {
  const startNodeData = createStartNodeData();
  const endNodeData = createEndNodeData();
  const edgeData = createEdgeData();

  return {
    data: {
      name,
      createdBy: 'userapi',
      editedBy: 'userapi'
    },
    nodes: [startNodeData, endNodeData],
    edges: [edgeData],
    viewport: getInitialViewData()
  };
};

export default validationSchema;
