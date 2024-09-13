import omit from 'lodash/omit';

import { IFlow } from '@domain/flow';

export const createDuplicateFlowData = (
  flow: IFlow,
  username: string,
  name: string
) => {
  const omitFlowData = omit(flow, ['id', 'data']);

  return {
    ...omitFlowData,
    data: {
      name,
      createdBy: username,
      editedBy: username
    }
  };
};
