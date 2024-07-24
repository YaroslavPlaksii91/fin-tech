import { Fragment, useState } from 'react';
import {
  Button,
  TableHead,
  Typography,
  TableCell,
  Box,
  Table as MuiTable
} from '@mui/material';
import { lightBlue, lightGreen } from '@mui/material/colors';

import {
  CATEGORIES,
  BOOLEAN_OPTIONS,
  CATEGORIES_TYPE,
  OBJECT_DATA_TYPES
} from '../constants';
import {
  VariableRowData,
  SelectedCell,
  FormFieldsProps,
  VariableColumnDataUpdate
} from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
import VariableInput from '../VariableInput/VariableInput';
import { getFormatedOptions, getHeaderCellBgColor } from '../utils';

import { Head, StyledTableBody } from './styled';

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
  handleSubmitVariableValue: (data: SelectedCell & FormFieldsProps) => void;
  hasUserPermission: boolean;
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  const handleClickOnMenu =
    (column: VariableColumnDataUpdate) =>
    (event: React.MouseEvent<HTMLElement>) => {
      handleSelectionColumn(column);
      setAnchorVariableMenu(event.currentTarget);
    };

  const getColSpanLength = (category: CATEGORIES_TYPE) =>
    columns.filter((column) => column.category === category).length;

  const handleCloseMenu = () => setAnchorVariableMenu(null);
  const handleCloseDialog = () => setIsDialogOpen(false);

  const handleAddVariable = () => {
    setIsDialogOpen(true);
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

  const handleSubmitSelectedCellData = (
    data: SelectedCell & FormFieldsProps
  ) => {
    handleSubmitVariableValue(data);
    setSelectedCell(null);
  };

  return (
    <>
      <MuiTable sx={{ borderCollapse: 'separate' }}>
        {/* @TODO: Find a way to take it out of the table part and calculate the width,
      thereby removing the extra styles for the table body use Paper with borders */}
        <TableHead>
          <StyledTableRow sx={{ th: { borderBottom: 'none', padding: 0 } }}>
            <TableCell colSpan={getColSpanLength('conditions')}>
              <Head
                sx={{
                  bgcolor: lightBlue[50],
                  borderRight: 'none',
                  borderRadius: '8px 0 0 8px'
                }}
              >
                <Typography variant="subtitle2">Input</Typography>
              </Head>
            </TableCell>
            <TableCell colSpan={getColSpanLength('actions') + 1}>
              <Head
                sx={{
                  bgcolor: lightGreen[50],
                  borderLeft: 'none',
                  borderRadius: '0 8px 8px 0'
                }}
              >
                <Typography variant="subtitle2">Output</Typography>
              </Head>
            </TableCell>
          </StyledTableRow>
        </TableHead>
        <StyledTableBody>
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
                    variableActionTitle={`Add ${column?.category === CATEGORIES.Conditions ? 'Input' : 'Output'} Variable`}
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
                  [
                    ...Object.values(DATA_TYPE_WITHOUT_ENUM),
                    ...OBJECT_DATA_TYPES
                  ].includes(dataType) && !isBooleanDataType;

                return (
                  <StyledTableCell
                    sx={{ cursor: 'pointer' }}
                    key={columnIndex}
                    onClick={() => {
                      hasUserPermission &&
                        isDataTypeWithoutEnum &&
                        setSelectedCell({
                          rowIndex,
                          category,
                          dataType,
                          ...row[name]
                        });
                    }}
                  >
                    {isDataTypeWithoutEnum ? (
                      <Typography variant="body2">
                        {hasValue
                          ? `${row[name].operator} ${row[name].expression}`
                          : `Enter ${column.category === CATEGORIES.Conditions ? 'Condition' : 'Value'}`}
                      </Typography>
                    ) : (
                      <SelectComponent
                        fullWidth
                        placeholder="Select Value"
                        value={row[name].expression || ''}
                        options={getFormatedOptions(
                          isBooleanDataType
                            ? BOOLEAN_OPTIONS
                            : allowedValues || []
                        )}
                        disabled={!hasUserPermission}
                        handleChange={(value) =>
                          handleSubmitSelectedCellData({
                            value,
                            category,
                            rowIndex,
                            dataType,
                            ...row[name],
                            operator: isBooleanDataType
                              ? '='
                              : row[name].operator
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
              <TableCell colSpan={columns.length + 1}>
                <Box py={2}>
                  <Typography variant="body2" textAlign="center">
                    No Expressions Yet.
                  </Typography>
                </Box>
              </TableCell>
            </StyledTableRow>
          ) : null}
        </StyledTableBody>
      </MuiTable>
      {selectedCell && (
        <SelectVariableValueDialog
          modalOpen={!!selectedCell}
          handleClose={() => setSelectedCell(null)}
          selectedRowCell={selectedCell}
          category={selectedCell.category}
          handleSubmitForm={handleSubmitSelectedCellData}
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
