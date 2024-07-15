import { Fragment, useState } from 'react';
import {
  Button,
  TableBody,
  TableHead,
  Typography,
  TableCell,
  Box,
  Table as MuiTable
} from '@mui/material';
import { lightBlue, lightGreen } from '@mui/material/colors';

import { CATEGORIES, BOOLEAN_OPTIONS, CATEGORIES_TYPE } from '../constants';
import {
  VariableRowData,
  SelectedCellInRowData,
  FormFieldsProps,
  VariableColumnDataUpdate
} from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
import VariableInput from '../VariableInput/VariableInput';
import { getFormatedOptions, getHeaderCellBgColor } from '../utils';

import { StyledStack, Head } from './styled';

import { theme } from '@theme';
import TrashIcon from '@icons/trash.svg';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import DataDictionaryDialog from '@components/DataDictionaryVariables/DataDictionaryDialog/DataDictionaryDialog.tsx';
import SelectComponent from '@views/DecisionTable/SelectComponent/SelectComponent';
import {
  DataDictionaryVariable,
  DATA_TYPE_WITHOUT_ENUM,
  Variable
} from '@domain/dataDictionary';

interface Table {
  stepIds: (string | null)[];
  defaultStepId: string | null;
  columns: VariableColumnDataUpdate[];
  rows: VariableRowData[];
  variables: Record<string, Variable[]>;
  searchableSelectOptions?: { value: string; label: string }[];
  selectedColumn: VariableColumnDataUpdate | null;
  handleSelectionColumn: (column: VariableColumnDataUpdate) => void;
  handleDeleteRow: (index: number) => void;
  handleInsertColumn: () => void;
  handleDeleteCategoryColumn: () => void;
  handleChangeStep: (rowIndex: number, stepId: string) => void;
  handleChangeColumnVariable: (
    newVariable: Pick<DataDictionaryVariable, 'name'>
  ) => void;
  handleSubmitVariableValue: (
    data: SelectedCellInRowData & FormFieldsProps
  ) => void;
  hasUserPermission?: boolean;
}

const Table = ({
  stepIds,
  defaultStepId,
  columns,
  rows,
  variables,
  searchableSelectOptions,
  selectedColumn,
  handleSelectionColumn,
  handleDeleteRow,
  handleInsertColumn,
  handleDeleteCategoryColumn,
  handleChangeColumnVariable,
  handleChangeStep,
  handleSubmitVariableValue,
  hasUserPermission
}: Table) => {
  const [anchorVariableMenu, setAnchorVariableMenu] =
    useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDiaglogOpen] = useState(false);
  const [selectedRowCell, setSelectedRowCell] =
    useState<SelectedCellInRowData | null>(null);

  const handleClickOnMenu =
    (column: VariableColumnDataUpdate) =>
    (event: React.MouseEvent<HTMLElement>) => {
      handleSelectionColumn(column);
      setAnchorVariableMenu(event.currentTarget);
    };

  const getColSpanLength = (category: CATEGORIES_TYPE) =>
    columns.filter((column) => column.category === category).length;

  const handleCloseMenu = () => setAnchorVariableMenu(null);
  const handleCloseDialog = () => setIsDiaglogOpen(false);

  const handleAddVariable = () => {
    setIsDiaglogOpen(true);
    handleCloseMenu();
  };

  const handleAddNewColumn = () => {
    handleInsertColumn();
    handleCloseMenu();
  };

  const handleDeleteColumn = () => {
    handleDeleteCategoryColumn();
    handleCloseMenu();
  };

  const handleSubmitSelectedRowCellData = (
    data: SelectedCellInRowData & FormFieldsProps
  ) => {
    handleSubmitVariableValue(data);
    setSelectedRowCell(null);
  };

  return (
    <>
      <MuiTable>
        <TableHead>
          <StyledTableRow>
            <TableCell
              sx={{ padding: 0 }}
              colSpan={getColSpanLength('conditions')}
            >
              <Head
                sx={{
                  bgcolor: lightBlue[50],
                  borderRight: 'none',
                  borderRadius: '4px 0 0 4px'
                }}
              >
                <Typography variant="subtitle2">Input</Typography>
              </Head>
            </TableCell>
            <TableCell
              sx={{ padding: 0 }}
              colSpan={getColSpanLength('actions') + 1}
            >
              <Head
                sx={{
                  bgcolor: lightGreen[50],
                  borderLeft: 'none',
                  borderRadius: '0 4px 4px 0'
                }}
              >
                <Typography variant="subtitle2">Output</Typography>
              </Head>
            </TableCell>
          </StyledTableRow>
          <StyledTableRow>
            {columns.map((column, columnIndex) => {
              const isLastConditionColumn =
                columns.filter(
                  ({ category }) => category === CATEGORIES.Conditions
                ).length === 1 && column.category === CATEGORIES.Conditions;

              const isCurrentMenuOpen =
                Boolean(anchorVariableMenu) &&
                column.index === selectedColumn?.index &&
                column.category === selectedColumn?.category;

              return (
                <TableCell
                  width={340}
                  key={columnIndex}
                  sx={{
                    padding: 0,
                    bgcolor: getHeaderCellBgColor(column.category)
                  }}
                >
                  <VariableInput
                    fullWidth
                    readOnly
                    sx={{
                      minWidth: '300px',
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                    }}
                    size="small"
                    open={isCurrentMenuOpen}
                    variableActionTitle={`Add ${selectedColumn?.category === CATEGORIES.Conditions ? 'Input' : 'Output'} Variable`}
                    value={column.name}
                    anchorEl={anchorVariableMenu}
                    handleAddVariable={handleAddVariable}
                    handleAddNewColumn={handleAddNewColumn}
                    handleDeleteColumn={handleDeleteColumn}
                    handleClickOnMenu={handleClickOnMenu(column)}
                    handleCloseMenu={handleCloseMenu}
                    isAddVariableDisabled={column.name === 'Step'}
                    isDeleteDisabled={
                      isLastConditionColumn || column.name === 'Step'
                    }
                    showActionButton={hasUserPermission}
                  />
                </TableCell>
              );
            })}
            <TableCell sx={{ bgcolor: lightGreen[50], width: 0 }} />
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <StyledTableRow
              key={rowIndex}
              parity={(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}
            >
              {columns.map((column, columnIndex) => {
                const { dataType, name, allowedValues, category } = column;

                if (name === 'Step') {
                  const value =
                    rowIndex >= stepIds.length
                      ? defaultStepId
                      : stepIds.find((_, stepIndex) => stepIndex === rowIndex);

                  return (
                    <Fragment key={columnIndex}>
                      <StyledTableCell>
                        <SelectComponent
                          fullWidth
                          placeholder="Select next step"
                          value={value || ''}
                          options={searchableSelectOptions || []}
                          handleChange={(stepId) =>
                            handleChangeStep(rowIndex, stepId)
                          }
                          disabled={!hasUserPermission}
                        />
                      </StyledTableCell>
                      {hasUserPermission && (
                        <StyledTableCell sx={{ padding: 0 }}>
                          {rows.length !== rowIndex + 1 ? (
                            <Button
                              sx={{ color: theme.palette.error.main }}
                              onClick={() => handleDeleteRow(rowIndex)}
                            >
                              <TrashIcon />
                            </Button>
                          ) : null}
                        </StyledTableCell>
                      )}
                    </Fragment>
                  );
                }

                if (!name.length || !row[name])
                  return (
                    <StyledTableCell key={columnIndex}>
                      {columnIndex === 0 && rows.length - 1 === rowIndex
                        ? 'Else'
                        : ''}
                    </StyledTableCell>
                  );

                const hasValue = row[name].expression || row[name].operator;

                const isBooleanDataType =
                  dataType === (DATA_TYPE_WITHOUT_ENUM.Boolean as string);

                const isDataTypeWithoutEnum =
                  Object.values<string>(DATA_TYPE_WITHOUT_ENUM).includes(
                    dataType
                  ) && !isBooleanDataType;

                const enumTypeSelectOptions =
                  !isBooleanDataType && allowedValues
                    ? allowedValues
                    : BOOLEAN_OPTIONS;

                return (
                  <StyledTableCell key={columnIndex}>
                    {isDataTypeWithoutEnum ? (
                      <StyledStack
                        onClick={() => {
                          hasUserPermission &&
                            setSelectedRowCell({
                              rowIndex,
                              category,
                              dataType,
                              ...row[name]
                            });
                        }}
                        disabled={!dataType.length}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Typography variant="body2">
                          {hasValue
                            ? `${row[name].operator} ${row[name].expression}`
                            : 'Enter Condition '}
                        </Typography>
                      </StyledStack>
                    ) : (
                      <SelectComponent
                        fullWidth
                        placeholder="Select Value"
                        value={row[name].expression || ''}
                        options={getFormatedOptions(enumTypeSelectOptions)}
                        handleChange={(value) =>
                          handleSubmitSelectedRowCellData({
                            value,
                            category,
                            rowIndex,
                            dataType,
                            ...row[name]
                          })
                        }
                      />
                    )}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
          ))}
          {!rows.length ? (
            <StyledTableRow sx={{ bgcolor: theme.palette.common.white }}>
              <TableCell sx={{ borderBottom: 0 }} colSpan={columns.length + 1}>
                <Box py={2}>
                  <Typography variant="body2" textAlign="center">
                    No Expressions Yet.
                  </Typography>
                </Box>
              </TableCell>
            </StyledTableRow>
          ) : null}
        </TableBody>
      </MuiTable>
      {selectedRowCell && (
        <SelectVariableValueDialog
          modalOpen={!!selectedRowCell}
          handleClose={() => setSelectedRowCell(null)}
          selectedRowCell={selectedRowCell}
          category={selectedRowCell.category}
          handleSubmitSelectedRowCellData={handleSubmitSelectedRowCellData}
        />
      )}
      <DataDictionaryDialog
        data={variables}
        title="Add Variable"
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleChangeColumnVariable}
      />
    </>
  );
};

export default Table;
