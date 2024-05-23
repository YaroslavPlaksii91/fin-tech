import { VARIABLES_TABS } from '../constants';

import { IFilterGroups } from './types';

import {
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX,
  INTEGRATION_VARIABLE_SOURCE_TYPE,
  INTEGRATION_VARIABLE_SOURCE_SUB_TYPE
} from '@domain/dataDictionary';

export const INITIAL_FILTERS = {
  dataType: [],
  sourceType: [],
  source: []
};

export const FILTER_GROUPS: IFilterGroups[] = [
  {
    filterBy: 'dataType',
    title: 'By Data Type',
    fields: Object.values({
      ...DATA_TYPE_WITHOUT_ENUM,
      ...DATA_TYPE_WITH_ENUM_PREFIX
    }),
    applyFor: Object.values(VARIABLES_TABS)
  },
  {
    filterBy: 'source',
    title: 'By CRA',
    fields: Object.values(INTEGRATION_VARIABLE_SOURCE_TYPE),
    applyFor: [VARIABLES_TABS.craReportVariables]
  },
  {
    filterBy: 'sourceType',
    title: 'By Report Name',
    fields: Object.values(INTEGRATION_VARIABLE_SOURCE_SUB_TYPE),
    applyFor: [VARIABLES_TABS.craReportVariables]
  }
];
