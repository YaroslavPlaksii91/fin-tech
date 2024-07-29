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

import { CATEGORIES, CATEGORY, BOOLEAN_OPTIONS, STEP } from '../constants';
import {
  SelectedCell,
  FormFieldsProps,
  VariableColumnData,
  OPERATORS,
  CaseEntry
} from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
import {
  checkDataType,
  filterVariablesByUsageMode,
  getFormatedOptions,
  getHeaderCellBgColor,
  parseStringFormat
} from '../utils';
import Select from '../Select';
import VariableInput from '../VariableInput';

import { Head, StyledTableBody } from './styled';

import { theme } from '@theme';
import TrashIcon from '@icons/trash.svg';
import AddIcon from '@icons/plusSquare.svg';
import GridSquarePlusIcon from '@icons/gridSquarePlus.svg';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import DataDictionaryDialog from '@components/DataDictionaryVariables/DataDictionaryDialog/DataDictionaryDialog';
import { DataDictionaryVariable, Variable } from '@domain/dataDictionary';

interface Table {
  stepIds: (string | null)[];
  defaultStepId: string | null;
  columns: VariableColumnData[];
  rows: Record<string, CaseEntry>[];
  variables: Record<string, Variable[]>;
  stepsOptions: { value: string; label: string }[];
  selectedColumn: VariableColumnData | null;
  handleSelectionColumn: (column: VariableColumnData) => void;
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
  stepsOptions,
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

  const onMenuClick =
    (column: VariableColumnData) => (event: React.MouseEvent<HTMLElement>) => {
      handleSelectionColumn(column);
      setAnchorVariableMenu(event.currentTarget);
    };

  const getColSpanLength = (category: CATEGORY) =>
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
            <TableCell colSpan={getColSpanLength(CATEGORIES.Conditions)}>
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
            <TableCell colSpan={getColSpanLength(CATEGORIES.Actions) + 1}>
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

              const menuItems = [
                {
                  key: 'add-variable-action',
                  disabled: column.name === STEP,
                  onClick: handleAddVariable,
                  icon: <AddIcon height={24} width={24} />,
                  text: `Add ${column?.category === CATEGORIES.Conditions ? 'Input' : 'Output'} Variable`
                },
                {
                  key: 'add-column-action',
                  disabled: false,
                  onClick: handleAddNewColumn,
                  icon: <GridSquarePlusIcon />,
                  text: 'Add Column'
                },
                {
                  key: 'delete-column-action',
                  disabled: isLastConditionColumn || column.name === STEP,
                  onClick: handleDeleteColumn,
                  icon: <TrashIcon />,
                  text: 'Delete Column'
                }
              ];

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
                    value={column.name}
                    menuItems={menuItems}
                    anchorEl={anchorVariableMenu}
                    onClick={onMenuClick(column)}
                    handleCloseMenu={handleCloseMenu}
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
                const { name, allowedValues } = column;
                const dataType = checkDataType(column.dataType);

                if (name === STEP) {
                  const value =
                    rowIndex >= stepIds.length
                      ? defaultStepId
                      : stepIds.find((_, stepIndex) => stepIndex === rowIndex);

                  return (
                    <Fragment key={columnIndex}>
                      <StyledTableCell>
                        <Select
                          fullWidth
                          placeholder="Select next step"
                          value={value || ''}
                          options={stepsOptions}
                          handleChange={(stepId) =>
                            handleChangeStep(rowIndex, stepId)
                          }
                          disabled={!hasUserPermission}
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: 0 }}>
                        {rows.length !== rowIndex + 1 && hasUserPermission ? (
                          <Button
                            sx={{ color: theme.palette.error.main }}
                            onClick={() => handleDeleteRow(rowIndex)}
                          >
                            <TrashIcon />
                          </Button>
                        ) : null}
                      </StyledTableCell>
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
                const expression = dataType.isString
                  ? parseStringFormat(row[name].expression)
                  : row[name].expression;

                return (
                  <StyledTableCell
                    sx={{ cursor: hasUserPermission ? 'pointer' : 'default' }}
                    key={columnIndex}
                    onClick={() => {
                      hasUserPermission &&
                        dataType.isWithoutEnum &&
                        !dataType.isBoolean &&
                        setSelectedCell({
                          ...row[name],
                          rowIndex,
                          expression,
                          category: column.category,
                          dataType: column.dataType
                        });
                    }}
                  >
                    {dataType.isWithoutEnum && !dataType.isBoolean ? (
                      <Typography variant="body2">
                        {hasValue
                          ? `${column.category === CATEGORIES.Actions ? OPERATORS.EQUAL : row[name].operator} ${expression}`
                          : `Enter ${column.category === CATEGORIES.Conditions ? 'Condition' : 'Value'}`}
                      </Typography>
                    ) : (
                      <Select
                        fullWidth
                        placeholder="Select Value"
                        value={row[name].expression}
                        options={getFormatedOptions(
                          dataType.isBoolean
                            ? BOOLEAN_OPTIONS
                            : allowedValues || []
                        )}
                        disabled={!hasUserPermission}
                        handleChange={(value) =>
                          handleSubmitSelectedCellData({
                            ...row[name],
                            value,
                            rowIndex,
                            category: column.category,
                            dataType: column.dataType,
                            operator: OPERATORS.EQUAL
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
          selectedCell={selectedCell}
          handleSubmitForm={handleSubmitSelectedCellData}
        />
      )}
      <DataDictionaryDialog
        data={filterVariablesByUsageMode(variables, selectedColumn?.category)}
        title="Add Variable"
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleChangeColumnVariable}
      />
    </>
  );
};

export default Table;
