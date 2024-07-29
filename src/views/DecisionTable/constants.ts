import { CaseEntry } from './types';

export enum CATEGORIES {
  Conditions = 'conditions',
  Actions = 'actions',
  DefaultActions = 'defaultActions'
}

export type CATEGORY = `${CATEGORIES}`;

export type CATEGORIES_WITHOUT_DEFAULT_ACTIONS = Exclude<
  CATEGORIES,
  CATEGORIES.DefaultActions
>;

export const BOOLEAN_OPTIONS = ['true', 'false'];

export const STEP_DETAILS =
  'A decision table is a step that allows to set expressions for columns and rows. The system will go through the table and analyze the values.';

export const INITIAL_ENTRY: CaseEntry = {
  name: '',
  operator: null,
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
