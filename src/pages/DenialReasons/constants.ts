export const DEFAULT_SORT = 'denialReason asc';

export const INITIAL_INPUT_FILTERS = {
  denialReasons: '',
  deniedBy: ''
};

export const INPUT_GROUPS_TO_SHOW = [
  {
    field: 'denialReasons',
    placeholder: 'Denial Reasons',
    label: 'Denial Reasons'
  },
  {
    field: 'deniedBy',
    placeholder: 'Denied by',
    label: 'Denied by'
  }
];

export const DEFAULT_EXPORT_FILE_NAME = 'lead-request-denial-reasons-reports';
