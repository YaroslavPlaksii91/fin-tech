import TrashIcon from '@icons/trash.svg';
import EditIcon from '@icons/editPencil.svg';
import BooksIcon from '@icons/books.svg';
import FileEditIcon from '@icons/fileEdit.svg';
import DuplicateSquareIcon from '@icons/duplicateSquare.svg';
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
  icon: <BooksIcon />
};

const duplicateOption = {
  label: 'Duplicate',
  dataKey: ActionTypes.DUPLICATE_FLOW,
  icon: <DuplicateSquareIcon />
};

const editOption = {
  label: 'Edit',
  dataKey: ActionTypes.EDIT_FLOW,
  icon: <EditIcon />
};

const renameOption = {
  label: 'Rename',
  dataKey: ActionTypes.RENAME_FLOW,
  icon: <FileEditIcon />
};

const deleteOption = {
  label: 'Delete',
  dataKey: ActionTypes.DELETE_FLOW,
  icon: <TrashIcon />,
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
