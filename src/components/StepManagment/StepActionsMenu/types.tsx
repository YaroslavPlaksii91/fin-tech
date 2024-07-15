import { theme } from '@theme';
import EditIcon from '@icons/editPencil.svg';
import FileEditIcon from '@icons/fileEdit.svg';
import DuplicateSquareIcon from '@icons/duplicateSquare.svg';
import EyeIcon from '@icons/eye.svg';
import TrashIcon from '@icons/trash.svg';
import { OptionsFlowParams } from '@components/FlowManagment/ActionsMenu/options';

export enum ActionTypes {
  STEP_TEXT_VIEW = 'StepTextView',
  EDIT_STEP = 'EditStep',
  RENAME_STEP = 'RenameStep',
  DUPLICATE_STEP = 'DuplicateStep',
  DELETE_STEP = 'DeleteStep'
}

export const viewStepOption = {
  label: 'View Step',
  dataKey: ActionTypes.STEP_TEXT_VIEW,
  icon: <EyeIcon />
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

export const getOptions = ({
  canUserViewFlow,
  canUserUpdateFlow
}: OptionsFlowParams) => [
  { ...viewStepOption, hide: !canUserViewFlow },
  { ...editStepOption, hide: !canUserUpdateFlow }
];

export const getProductionFlowOptions = ({
  canUserViewFlow
}: OptionsFlowParams) => [{ ...viewStepOption, hide: !canUserViewFlow }];

export const getEditModeOptions = ({
  canUserViewFlow,
  canUserUpdateFlow
}: OptionsFlowParams) => [
  { ...viewStepOption, hide: !canUserViewFlow },
  { ...editStepOption, hide: !canUserUpdateFlow },
  { ...renameStepOption, hide: !canUserUpdateFlow },
  duplicateStepOption,
  { ...deleteStepOption, hide: !canUserUpdateFlow }
];
