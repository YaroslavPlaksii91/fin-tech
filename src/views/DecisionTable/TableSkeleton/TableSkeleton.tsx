import { useState, SyntheticEvent } from 'react';
import {
  Button,
  Box,
  TableBody,
  TableHead,
  Autocomplete,
  Typography
} from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';

import {
  CATEGORIES,
  BOOLEAN_OPTIONS,
  CATEGORIES_WITHOUT_ELSE_ACTIONS
} from '../constants';
import {
  VariableRowData,
  VariableColumnData,
  SelectedCellInRowData,
  TableSkeletonProps,
  FormFieldsProps
} from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
import { AutocompleteInput } from '../AutocompleteInput/AutocompleteInput';

import { StyledTable, StyledStack } from './styled';

import { DeleteOutlineIcon } from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import SelectComponent from '@views/DecisionTable/SelectComponent/SelectComponent';
import {
  DataDictionaryVariable,
  UserDefinedVariable,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX
} from '@domain/dataDictionary';

const TableSkeleton = ({
  columns,
  rows,
  variablesOptions,
  columnClickedIndex,
  category,
  handleDeleteRow,
  handleChangeColumnClickedIndex,
  handleInsertingColumn,
  handleDeleteCategoryColumn,
  handleChangeColumnVariable,
  handleSubmitVariableValue,
  handleSubmitVariableValueForEnum
}: TableSkeletonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowCell, setSelectedRowCell] =
    useState<SelectedCellInRowData | null>(null);

  const open = Boolean(anchorEl);
  const isTheLastCategoryColumn = columns.length <= 1;

  const handleClickOnMenu = (
    event: React.MouseEvent<HTMLElement>,
    columnClickedIndexNew: number
  ) => {
    setAnchorEl(event.currentTarget);

    handleChangeColumnClickedIndex?.(columnClickedIndexNew);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddNewColumn = (columnClickedIndex: number) => {
    handleInsertingColumn?.({
      columnClickedIndex,
      category: category as CATEGORIES_WITHOUT_ELSE_ACTIONS
    });
    handleCloseMenu();
  };

  const handleDeleteColumn = (columnVariableName: string) => {
    handleDeleteCategoryColumn?.({
      columnVariableName,
      category: category as CATEGORIES_WITHOUT_ELSE_ACTIONS
    });
    handleCloseMenu();
  };

  const handleSubmitSelectedRowCellData = (
    data: SelectedCellInRowData & FormFieldsProps
  ) => {
    handleSubmitVariableValue({
      formFieldData: data,
      category: category as CATEGORIES_WITHOUT_ELSE_ACTIONS
    });
    setSelectedRowCell(null);
  };

  const getOptions = () => {
    const columnsVariables = columns.map(
      (column: VariableColumnData) => column.name
    );

    const newOptions: (DataDictionaryVariable | UserDefinedVariable)[] =
      variablesOptions.filter(
        (option: DataDictionaryVariable | UserDefinedVariable) =>
          !columnsVariables.includes(option.name)
      );

    return newOptions;
  };

  return (
    <>
      <StyledTable sx={{ minWidth: 650 }}>
        <TableHead>
          <StyledTableRow>
            {columns.map((column: VariableColumnData, index: number) => (
              <StyledTableCell key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Autocomplete
                    options={getOptions()}
                    sx={{
                      width: '100%',
                      minWidth: 250
                    }}
                    size="small"
                    value={column}
                    disableClearable={true}
                    forcePopupIcon={false}
                    disabled={category === CATEGORIES.ElseActions}
                    getOptionLabel={(
                      option: Pick<DataDictionaryVariable, 'name'>
                    ) => (option ? option.name : '')}
                    onChange={(
                      event: SyntheticEvent<Element, Event>,
                      newValue
                    ) => {
                      event &&
                        handleChangeColumnVariable?.({
                          columnIndex: index,
                          newVariable: newValue,
                          category: category as CATEGORIES_WITHOUT_ELSE_ACTIONS
                        });
                    }}
                    renderInput={(params: TextFieldProps) => (
                      <AutocompleteInput
                        {...params}
                        open={open}
                        variableName={column.name}
                        columnClickedIndex={columnClickedIndex}
                        anchorEl={anchorEl}
                        columnIndex={index}
                        category={category}
                        handleAddNewColumn={handleAddNewColumn}
                        handleDeleteColumn={handleDeleteColumn}
                        handleClickOnMenu={handleClickOnMenu}
                        handleCloseMenu={handleCloseMenu}
                        isTheLastCategoryColumn={isTheLastCategoryColumn}
                      />
                    )}
                  />
                </Box>
              </StyledTableCell>
            ))}
            {category === CATEGORIES.Actions && (
              <StyledTableCell></StyledTableCell>
            )}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: VariableRowData, rowIndex: number) => (
            <StyledTableRow key={rowIndex} sx={{ height: '62px' }}>
              {columns.map(
                (column: VariableColumnData, columnIndex: number) => {
                  // define cell value for each row
                  const cellValue =
                    row[column.name as keyof VariableRowData].expression ||
                    row[column.name as keyof VariableRowData].operator ? (
                      `${row[column.name as keyof VariableRowData].operator} ${
                        row[column.name as keyof VariableRowData].expression
                      }`
                    ) : (
                      <Typography variant="body2">Select value</Typography>
                    );

                  return (
                    <StyledTableCell key={columnIndex}>
                      {Object.values(DATA_TYPE_WITHOUT_ENUM).includes(
                        column.dataType as DATA_TYPE_WITHOUT_ENUM
                      ) &&
                        (column.dataType as DATA_TYPE_WITHOUT_ENUM) !==
                          DATA_TYPE_WITHOUT_ENUM['Boolean'] && (
                          <StyledStack
                            onClick={() =>
                              setSelectedRowCell({
                                rowIndex,
                                variableName: column.name,
                                dataType: column.dataType
                              })
                            }
                            disabled={!column.dataType.length}
                            sx={{ cursor: 'pointer' }}
                          >
                            {cellValue}
                          </StyledStack>
                        )}
                      {/* Controller for the enum type of variables */}
                      {(Object.values(DATA_TYPE_WITH_ENUM_PREFIX).includes(
                        column.dataType as DATA_TYPE_WITH_ENUM_PREFIX
                      ) ||
                        (column.dataType as DATA_TYPE_WITHOUT_ENUM) ===
                          DATA_TYPE_WITHOUT_ENUM.Boolean) && (
                        <SelectComponent
                          rowIndex={rowIndex}
                          category={category}
                          variableName={column.name}
                          value={
                            row[column.name as keyof VariableRowData]
                              .expression ?? ''
                          }
                          options={
                            (column.dataType as DATA_TYPE_WITHOUT_ENUM) !==
                              DATA_TYPE_WITHOUT_ENUM.Boolean &&
                            column?.allowedValues
                              ? column?.allowedValues
                              : BOOLEAN_OPTIONS
                          }
                          fullWidth
                          handleSubmitVariableValueForEnum={
                            handleSubmitVariableValueForEnum
                          }
                        />
                      )}
                    </StyledTableCell>
                  );
                }
              )}
              {!!rows.length && category === CATEGORIES.Actions && (
                <StyledTableCell sx={{ padding: 0 }} width={40}>
                  <Button
                    fullWidth
                    sx={{ padding: '10px' }}
                    onClick={() => handleDeleteRow?.(rowIndex)}
                    disabled={rows.length <= 1}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </StyledTableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>

      {selectedRowCell && (
        <SelectVariableValueDialog
          modalOpen={!!selectedRowCell}
          handleClose={() => setSelectedRowCell(null)}
          selectedRowCell={selectedRowCell}
          category={category}
          handleSubmitSelectedRowCellData={handleSubmitSelectedRowCellData}
        />
      )}
    </>
  );
};

export default TableSkeleton;
