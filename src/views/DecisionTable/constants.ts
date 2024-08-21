import { CaseEntry, Entry } from './types';

export const BOOLEAN_OPTIONS = ['true', 'false'];

export const STEP_DETAILS =
  'A decision table is a step that allows to set expressions for columns and rows. The system will go through the table and analyze the values.';

export const INITIAL_ENTRY: Entry = {
  name: '',
  operator: '',
  expression: ''
};

const INITIAL_CASE_ENTRY: CaseEntry = {
  conditions: [INITIAL_ENTRY],
  actions: [],
  edgeId: null
};

export const INITIAL_CASE_ENTRIES = [INITIAL_CASE_ENTRY, INITIAL_CASE_ENTRY];

export const STEP = 'Step';
export const OBJECT = 'Object';
