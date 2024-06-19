import {
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX,
  INTEGRATION_VARIABLE_SOURCE_TYPE,
  INTEGRATION_VARIABLE_SOURCE_SUB_TYPE
} from '@domain/dataDictionary';

export const TABS_LABELS: { [key: string]: string } = {
  laPMSVariables: 'LaPMS (Input)',
  userDefined: 'User Defined',
  outputVariables: 'Output',
  historicDataVariables: 'Underwriting History',
  craReportVariables: 'CRA Reports'
};

export const SOURCES_DESCRIPTIONS: { [key: string]: string } = {
  laPMSVariables:
    'This source contains all the variables from Lead Request sent to underwriting as input from the Lead and Provider Management System (LaPMS)',
  userDefined:
    'This source contains all the variable that user defined on his own, this list include temporary, permanent variables as well as constants',
  historicDataVariables:
    'This source contains variables that are calculated from the underwriting history and decision engine reporting.',
  outputVariables:
    'This source contains variables that the Risk Manager must initialize and the Underwriting Platform must include in the request to the Loan Management System (LMS), otherwise the flow will not be production-ready.',
  craReportVariables:
    'This source contains the data about the leads we may receive from multiple Credit Rating Agencies (CRAs). When designing the flow the Risk Manager must fetch this data explicitly via the GET_REPORT function in the calculation step.'
};

export enum VARIABLES_TABS {
  laPMSVariables = 'laPMSVariables',
  userDefined = 'userDefined',
  outputVariables = 'outputVariables',
  historicDataVariables = 'historicDataVariables',
  craReportVariables = 'craReportVariables',
  all = 'all'
}

export const INITIAL_FILTERS = {
  dataType: [],
  sourceType: [],
  source: []
};

export const FILTER_GROUPS = [
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
