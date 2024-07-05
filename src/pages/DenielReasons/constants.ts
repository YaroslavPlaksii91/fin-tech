export const DEFAULT_SORT = 'denialReason asc';

export const INITIAL_INPUT_FILTERS = {
  denialReasons: '',
  deniedBy: ''
};

export const INPUT_GROUPS_TO_SHOW = [
  {
    field: 'denialReasons',
    placeholder: 'Denial Reasons'
  },
  {
    field: 'deniedBy',
    placeholder: 'Denied by'
  }
];
