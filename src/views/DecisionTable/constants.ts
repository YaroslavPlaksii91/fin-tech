import { CaseEntry } from './types';

export const BOOLEAN_OPTIONS = ['true', 'false'];

export const STEP_DETAILS =
  'A decision table is a step that allows to set expressions for columns and rows. The system will go through the table and analyze the values.';

export const INITIAL_ENTRY: CaseEntry = {
  name: '',
  operator: '',
  expression: ''
};

export const INITIAL_CASE_ENTRIES = [
  {
    conditions: [],
    actions: [],
    edgeId: null
  }
];

export const INITIAL_STEP_IDS = [null, null];

export const STEP = 'Step';
export const OBJECT = 'Object';
