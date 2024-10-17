import { FILTER_BY } from './types';

import { Variable, DATA_DICTIONARY_GROUP } from '@domain/dataDictionary';

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
  all: TAB_ALL
};

export const TABS_LABELS: { [key: string]: string } = {
  laPMSVariables: 'Application (Input)',
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

export interface TableHeader {
  key: keyof Variable;
  label?: string;
  maxWidth?: string;
  render?: (row: Variable) => void;
}

export const DEFAULT_HEADERS: TableHeader[] = [
  { key: 'name', label: 'Variable Name' },
  { key: 'dataType', label: 'Data Type' },
  { key: 'allowedValues', label: 'Allowed Values', maxWidth: '150px' },
  { key: 'defaultValue', label: 'Default Value' },
  { key: 'description', label: 'Description' },
  { key: 'isRequired', label: 'Required' }
];

export const CRA_REPORTS_HEADERS: TableHeader[] = [
  { key: 'source', label: 'CRA' },
  { key: 'sourceType', label: 'ReportName' },
  ...DEFAULT_HEADERS
];

export const STRING_ARRAY_HINT =
  'A string Array is a collection or list of string values, where each element in the array holds a string - ["value1", "value2", "value"...”N”].<br/><br/>Example: ["SSN1", "SSN2", "SSN3"]';
