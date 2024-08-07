import { CaseEntry } from './types';

export enum CATEGORIES {
  Conditions = 'conditions',
  Actions = 'actions'
}

export type CATEGORY = `${CATEGORIES}`;

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

export const STEP = 'Step';
