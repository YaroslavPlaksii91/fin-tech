import { CATEGORIES } from './constants';

import {
  DataDictionaryVariable,
  DATA_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX
} from '@domain/dataDictionary';

export type VariableRowData = {
  [key: string]: {
    name: string;
    operator: string;
    expression: string;
  };
};

export type SelectedCellInRowData = {
  rowIndex: number;
  variableName: string;
  dataType: string;
};

export type VariableColumnData = {
  name: string;
  dataType: DATA_TYPE | string;
  allowedValues?: string | string[];
};

export type TableSkeletonProps = {
  columns: VariableColumnData[];
  rows: VariableRowData[];
  variablesOptions: DataDictionaryVariable[];
  columnClickedIndex?: number;
  category: CATEGORIES;
  handleDeleteRow?: (index: number) => void;
  handleChangeColumnClickedIndex?: (
    newColumnIndex: number,
    category: CATEGORIES
  ) => void;
  handleInsertingColumn?: ({
    columnClickedIndex
  }: {
    columnClickedIndex: number;
  }) => void;
  handleDeleteCategoryColumn?: ({
    columnVariableName
  }: {
    columnVariableName: string;
  }) => void;
  handleChangeColumnVariable?: ({
    columnIndex,
    newVariable
  }: {
    columnIndex: number;
    newVariable: Pick<DataDictionaryVariable, 'name'>;
  }) => void;
  handleSubmitVariableValue: ({
    formFieldData
  }: {
    formFieldData: any;
  }) => void;
  handleSubmitVariableValueForEnum: ({
    rowIndex,
    variableName,
    newEnumValue
  }: {
    rowIndex: number;
    variableName: string;
    newEnumValue: string;
  }) => void;
};
