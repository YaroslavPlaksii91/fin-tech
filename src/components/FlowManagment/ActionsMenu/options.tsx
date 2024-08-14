import TrashIcon from '@icons/trash.svg';
import EditIcon from '@icons/edit.svg';
import DataDictionaryIcon from '@icons/data-dictionary.svg';
import RenameIcon from '@icons/rename.svg';
import CopyIcon from '@icons/copy.svg';
import { theme } from '@theme';

export enum ActionTypes {
  VIEW_DATA_DICTIONARY = 'viewDataDictionary',
  DUPLICATE_FLOW = 'duplicateFlow',
  EDIT_FLOW = 'editFlow',
  RENAME_FLOW = 'renameFlow',
  DELETE_FLOW = 'deleteFlow'
}

const viewDataDictionaryOption = {
  label: 'View Data Dictionary',
  dataKey: ActionTypes.VIEW_DATA_DICTIONARY,
  icon: <DataDictionaryIcon />
};

const duplicateOption = {
  label: 'Duplicate',
  dataKey: ActionTypes.DUPLICATE_FLOW,
  icon: <CopyIcon />
};

const editOption = {
  label: 'Edit',
  dataKey: ActionTypes.EDIT_FLOW,
  icon: <EditIcon />
};

const renameOption = {
  label: 'Rename',
  dataKey: ActionTypes.RENAME_FLOW,
  icon: <RenameIcon />
};

const deleteOption = {
  label: 'Delete',
  dataKey: ActionTypes.DELETE_FLOW,
  icon: <TrashIcon color={theme.palette.error.main} />, // TODO: change icon
  textColor: theme.palette.error.main
};

export interface OptionsFlowParams {
  canUserViewFlow?: boolean;
  canUserUpdateFlow?: boolean;
  canUserDeleteFlow?: boolean;
  canUserCreateFlow?: boolean;
}

export const getOptionsProductionFlow = ({
  canUserViewFlow
}: OptionsFlowParams) => [
  { ...viewDataDictionaryOption, hide: !canUserViewFlow }
];

export const getOptionsDraftFlow = ({
  canUserViewFlow,
  canUserUpdateFlow,
  canUserDeleteFlow,
  canUserCreateFlow
}: OptionsFlowParams) => [
  { ...viewDataDictionaryOption, hide: !canUserViewFlow },
  { ...duplicateOption, hide: !canUserCreateFlow },
  { ...editOption, hide: !canUserUpdateFlow },
  { ...renameOption, hide: !canUserUpdateFlow },
  { ...deleteOption, hide: !canUserDeleteFlow }
];
