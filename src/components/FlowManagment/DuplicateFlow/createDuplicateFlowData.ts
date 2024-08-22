import omit from 'lodash/omit';

import { IFlow } from '@domain/flow';

export const createDuplicateFlowData = (flow: IFlow, username: string) => {
  const omitFlowData = omit(flow, ['id', 'data']);

  return {
    ...omitFlowData,
    data: {
      name: `Copy of (${flow.data.name})`,
      createdBy: username,
      editedBy: username
    }
  };
};
