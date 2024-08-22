import * as yup from 'yup';

import { JSONPatchOperation } from '@domain/entity';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Flow name is required')
    .max(30, 'Flow name cannot have more than 30 characters')
});

export const updateFlowDataHelper = (
  id: string,
  name: string,
  username: string
): { id: string; operations: JSONPatchOperation[] } => ({
  id,
  operations: [
    {
      value: name,
      path: 'data/name',
      op: 'replace'
    },
    {
      value: username,
      path: 'data/editedBy',
      op: 'replace'
    }
  ]
});
