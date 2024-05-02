import { theme } from '@theme';
import EditIcon from '@icons/editPencil.svg';
import FileEditIcon from '@icons/fileEdit.svg';
import DuplicateSquareIcon from '@icons/duplicateSquare.svg';
import FileIcon from '@icons/file.svg';
import TrashIcon from '@icons/trash.svg';

export enum ActionTypes {
  STEP_TEXT_VIEW = 'StepTextView',
  EDIT_STEP = 'EditStep',
  RENAME_STEP = 'RenameStep',
  DUPLICATE_STEP = 'DuplicateStep',
  DELETE_STEP = 'DeleteStep'
}

export const viewStepOption = {
  label: 'Step text view',
  dataKey: ActionTypes.STEP_TEXT_VIEW,
  icon: <FileIcon />
};

export const renameStepOption = {
  label: 'Rename step',
  dataKey: ActionTypes.RENAME_STEP,
  icon: <FileEditIcon />
};
export const duplicateStepOption = {
  label: 'Duplicate step',
  dataKey: ActionTypes.DUPLICATE_STEP,
  icon: <DuplicateSquareIcon />
};

export const editStepOption = {
  label: 'Edit step',
  dataKey: ActionTypes.EDIT_STEP,
  icon: <EditIcon />
};

export const deleteStepOption = {
  label: 'Delete step',
  dataKey: ActionTypes.DELETE_STEP,
  icon: <TrashIcon color={theme.palette.error.main} />,
  textColor: theme.palette.error.main
};

export const options = [viewStepOption, editStepOption];

export const editModeOptions = [
  viewStepOption,
  editStepOption,
  renameStepOption,
  duplicateStepOption,
  deleteStepOption
];
