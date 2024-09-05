import { TAB, FILTER_BY } from './types';

import {
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX,
  INTEGRATION_VARIABLE_SOURCE_TYPE,
  INTEGRATION_VARIABLE_SOURCE_SUB_TYPE,
  Variable,
  DATA_DICTIONARY_GROUP
} from '@domain/dataDictionary';

export const SOURCES_DESCRIPTIONS: { [key: string]: string } = {
  laPMSVariables:
    'This source contains all the variables from Lead Request sent to underwriting as input from the Lead and Provider Management System (LaPMS)',
  lmsInputVariables:
    'This source contains the data that we fetch from LMS - PLMInfinity.',
  userDefined:
    'This source contains all the variable that user defined on his own, this list include temporary, permanent variables as well as constants',
  historicDataVariables:
    'This source contains variables that are calculated from the underwriting history and decision engine reporting.',
  outputVariables:
    'This source contains variables that the Risk Manager must initialize and the Underwriting Platform must include in the request to the Loan Management System (LMS), otherwise the flow will not be production-ready.',
  craReportVariables:
    'This source contains the data about the leads we may receive from multiple Credit Rating Agencies (CRAs). When designing the flow the Risk Manager must fetch this data explicitly via the GET_REPORT function in the calculation step.'
};

export const TAB_ALL = 'all';
export const TABS = {
  ...DATA_DICTIONARY_GROUP,
  all: TAB_ALL as typeof TAB_ALL
};

export const TABS_LABELS: { [key: string]: string } = {
  laPMSVariables: 'LaPMS (Input)',
  lmsInputVariables: 'LMS',
  userDefined: 'User Defined',
  outputVariables: 'Output',
  historicDataVariables: 'Underwriting History',
  craReportVariables: 'CRA Reports',
  all: 'All'
};

export const INITIAL_FILTERS = {
  [FILTER_BY.dataType]: [],
  [FILTER_BY.sourceType]: [],
  [FILTER_BY.source]: []
};

export const FILTER_GROUPS = [
  {
    filterBy: FILTER_BY.dataType,
    text: 'By Data Type',
    fields: Object.values({
      ...DATA_TYPE_WITHOUT_ENUM,
      ...DATA_TYPE_WITH_ENUM_PREFIX
    }),
    applyFor: Object.values(TABS) as TAB[]
  },
  {
    filterBy: FILTER_BY.source,
    text: 'By CRA',
    fields: Object.values(INTEGRATION_VARIABLE_SOURCE_TYPE),
    applyFor: [TABS.craReportVariables] as TAB[]
  },
  {
    filterBy: FILTER_BY.sourceType,
    text: 'By Report Name',
    fields: Object.values(INTEGRATION_VARIABLE_SOURCE_SUB_TYPE),
    applyFor: [TABS.craReportVariables] as TAB[]
  }
];

export interface TableHeader {
  key: keyof Variable;
  label?: string;
  render?: (row: Variable) => void;
}

export const DEFAULT_HEADERS: TableHeader[] = [
  { key: 'name', label: 'Variable Name' },
  { key: 'dataType', label: 'Data Type' },
  { key: 'defaultValue', label: 'Default Value' },
  { key: 'description', label: 'Description' },
  { key: 'isRequired', label: 'Required' }
];

export const CRA_REPORTS_HEADERS: TableHeader[] = [
  { key: 'source', label: 'CRA' },
  { key: 'sourceType', label: 'ReportName' },
  ...DEFAULT_HEADERS
];
