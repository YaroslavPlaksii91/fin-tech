import { ExternalSystemsData } from '@domain/waterfallReport';

export const DEFAULT_SORT = 'totalLooks';
export const TOTAL_ROW_NAME = 'Total';

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

export const INITIAL_DATE_FILTERS = {
  from: null,
  to: null
};
