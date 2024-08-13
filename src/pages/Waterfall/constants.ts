import { ExternalSystemsData } from '@domain/waterfallReport';

export const DEFAULT_SORT = 'totalLooks';
export const TOTAL_ROW_NAME = 'Total';
export const INITIAL_INPUT_FILTERS = { stack: '', campaignId: '' };

export const INPUT_GROUPS_TO_SHOW = [
  {
    field: 'stack',
    placeholder: 'Stack',
    label: 'Stack'
  },
  {
    field: 'campaignId',
    placeholder: 'Campaign ID',
    label: 'Campaign ID'
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

export const DEFAULT_EXPORT_FILE_NAME = 'waterfall-reports';
