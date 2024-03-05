import { CATEGORIES, CATEGORIES_WITHOUT_ELSE_ACTIONS } from './constants';

import {
  DataDictionaryVariable,
  UserDefinedVariable,
  DATA_TYPE
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

export type FormFieldsProps = {
  variableName: string;
  operator: string;
  value?: string;
  lowerBound?: number | null;
  upperBound?: number | null;
};

export type TableSkeletonProps = {
  columns: VariableColumnData[];
  rows: VariableRowData[];
  variablesOptions: (DataDictionaryVariable | UserDefinedVariable)[];
  columnClickedIndex?: number;
  category: CATEGORIES;
  handleDeleteRow?: (index: number) => void;
  handleChangeColumnClickedIndex?: (newColumnIndex: number) => void;
  handleInsertingColumn?: ({
    columnClickedIndex,
    category
  }: {
    columnClickedIndex: number;
    category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  }) => void;
  handleDeleteCategoryColumn?: ({
    columnVariableName,
    category
  }: {
    columnVariableName: string;
    category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  }) => void;
  handleChangeColumnVariable?: ({
    columnIndex,
    newVariable,
    category
  }: {
    columnIndex: number;
    newVariable: Pick<DataDictionaryVariable, 'name'>;
    category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  }) => void;
  handleSubmitVariableValue: ({
    formFieldData,
    category
  }: {
    formFieldData: SelectedCellInRowData & FormFieldsProps;
    category: CATEGORIES;
  }) => void;
  handleSubmitVariableValueForEnum: ({
    rowIndex,
    variableName,
    newEnumValue,
    category
  }: {
    rowIndex: number;
    variableName: string;
    newEnumValue: string;
    category: CATEGORIES;
  }) => void;
};
