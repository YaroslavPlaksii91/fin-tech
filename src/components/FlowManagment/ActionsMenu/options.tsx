import {
  Books,
  CopyAlt,
  Edit,
  FileEdit,
  Trash
} from '@components/shared/Icons';
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
  icon: <Books />
};

const duplicateOption = {
  label: 'Duplicate',
  dataKey: ActionTypes.DUPLICATE_FLOW,
  icon: <CopyAlt />
};

const editOption = {
  label: 'Edit',
  dataKey: ActionTypes.EDIT_FLOW,
  icon: <Edit />
};

const renameOption = {
  label: 'Rename',
  dataKey: ActionTypes.RENAME_FLOW,
  icon: <FileEdit />
};

const deleteOption = {
  label: 'Delete',
  dataKey: ActionTypes.DELETE_FLOW,
  icon: <Trash />,
  textColor: theme.palette.error.main
};

export const optionsProductionFlow = [viewDataDictionaryOption];

export const optionsDraftFlow = [
  viewDataDictionaryOption,
  duplicateOption,
  editOption,
  renameOption,
  deleteOption
];
