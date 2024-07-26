import { CaseEntry } from './types';

import { DATA_TYPE_WITHOUT_ENUM } from '@domain/dataDictionary';

export const OBJECT_DATA_TYPES = [
  'Object', // @TODO need to clarify if we need this
  DATA_TYPE_WITHOUT_ENUM['Object:CraClarity'],
  DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']
];

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
