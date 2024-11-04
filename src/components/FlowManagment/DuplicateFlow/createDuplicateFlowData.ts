import * as _ from 'lodash-es';

import { IFlow } from '@domain/flow';

export const createDuplicateFlowData = (
  flow: IFlow,
  username: string,
  name: string
) => {
  const omitFlowData = _.omit(flow, ['id', 'data']);

  return {
    ...omitFlowData,
    data: {
      name,
      createdBy: username,
      editedBy: username
    }
  };
};
