import { theme } from '../../../themeConfig';

import {
  CopyAlt,
  Edit,
  FileEdit,
  FileText,
  Trash
} from '@components/shared/Icons';

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
  icon: <FileText />
};

export const renameStepOption = {
  label: 'Rename step',
  dataKey: ActionTypes.RENAME_STEP,
  icon: <FileEdit />
};
export const duplicateStepOption = {
  label: 'Duplicate step',
  dataKey: ActionTypes.DUPLICATE_STEP,
  icon: <CopyAlt />
};

export const editStepOption = {
  label: 'Edit step',
  dataKey: ActionTypes.EDIT_STEP,
  icon: <Edit />
};

export const deleteStepOption = {
  label: 'Delete step',
  dataKey: ActionTypes.DELETE_STEP,
  icon: <Trash />,
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