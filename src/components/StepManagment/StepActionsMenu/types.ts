export enum ActionTypes {
  OBJECT_TEXT_VIEW = 'ObjectTextView',
  EDIT_OBJECT = 'EditObject',
  RENAME_OBJECT = 'RenameObject',
  DUPLICATE_OBJECT = 'DuplicateObject'
}

export const options = [
  { label: 'Object text view', dataKey: ActionTypes.OBJECT_TEXT_VIEW },
  { label: 'Edit object', dataKey: ActionTypes.EDIT_OBJECT },
  { label: 'Rename object', dataKey: ActionTypes.RENAME_OBJECT },
  { label: 'Duplicate object', dataKey: ActionTypes.DUPLICATE_OBJECT }
];
