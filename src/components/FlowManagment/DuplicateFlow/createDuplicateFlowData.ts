import omit from 'lodash/omit';

import { IFlow } from '@domain/flow';

export const createDuplicateFlowData = (flow: IFlow) => {
  const omitFlowData = omit(flow, ['id', 'data']);
  // @TODO: Real username
  const username = 'username';

  return {
    ...omitFlowData,
    data: {
      name: `Copy of (${flow.data.name})`,
      createdBy: username,
      editedBy: username
    }
  };
};
