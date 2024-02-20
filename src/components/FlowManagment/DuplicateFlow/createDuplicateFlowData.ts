import omit from 'lodash/omit';

import { IFlow } from '@domain/flow';
import Auth from '@utils/auth';

export const createDuplicateFlowData = (flow: IFlow) => {
  const omitFlowData = omit(flow, ['id', 'data']);
  const username = Auth.getUsername();

  return {
    ...omitFlowData,
    data: {
      name: `Copy of (${flow.data.name})`,
      createdBy: username,
      editedBy: username
    }
  };
};
