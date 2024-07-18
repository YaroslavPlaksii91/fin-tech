import { ExternalSystemsData } from '@domain/waterfallReport';

export const DEFAULT_SORT = 'totalLooks';
export const AGGREGATION_ROW_STACK_NAME = 'Total';
export const INITIAL_INPUT_FILTERS = { stack: '', campaignId: '' };

export const INPUT_GROUPS_TO_SHOW = [
  {
    field: 'stack',
    placeholder: 'Stack'
  },
  {
    field: 'campaignId',
    placeholder: 'Campaign ID'
  }
];

export const GROUP_COLORS_NAMES = [
  'lightBlue',
  'teal',
  'lightGreen',
  'deepPurple'
];

export const EXTERNAL_SYSTEM_KEYS: (keyof ExternalSystemsData)[] = [
  'looks',
  'approved',
  'cost',
  'savings',
  'timeouts'
];
