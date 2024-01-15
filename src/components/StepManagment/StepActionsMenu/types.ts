export enum ActionTypes {
  STEP_TEXT_VIEW = 'StepTextView',
  EDIT_STEP = 'EditStep',
  RENAME_STEP = 'RenameStep',
  DUPLICATE_STEP = 'DuplicateStep'
}

export const options = [
  { label: 'Step text view', dataKey: ActionTypes.STEP_TEXT_VIEW },
  { label: 'Edit step', dataKey: ActionTypes.EDIT_STEP },
  { label: 'Rename step', dataKey: ActionTypes.RENAME_STEP },
  { label: 'Duplicate step', dataKey: ActionTypes.DUPLICATE_STEP }
];
