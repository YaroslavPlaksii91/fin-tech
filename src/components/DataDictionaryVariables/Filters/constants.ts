import { IFiltersGroup } from './types';

import {
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX
} from '@domain/dataDictionary';

export const INITIAL_FILTERS = {
  dataType: [],
  sourceType: [],
  source: []
};

export const FILTERS_GROUPS: IFiltersGroup[] = [
  {
    filterBy: 'dataType',
    title: 'By Data Type',
    fields: Object.values({
      ...DATA_TYPE_WITHOUT_ENUM,
      ...DATA_TYPE_WITH_ENUM_PREFIX
    })
  },
  {
    filterBy: 'sourceType',
    title: 'By Report Name',
    fields: Object.values({
      ...DATA_TYPE_WITHOUT_ENUM,
      ...DATA_TYPE_WITH_ENUM_PREFIX
    })
  }
];
