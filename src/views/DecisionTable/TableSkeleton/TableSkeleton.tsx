import { useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableHead,
  Typography,
  TableCell
} from '@mui/material';
// import { last } from 'lodash';
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
  DATA_TYPE_WITH_ENUM_PREFIX,
  Variable
} from '@domain/dataDictionary';

interface TableSkeletonProps {
  steps: {
    rowIndex: number;
    edgeId: string | null;
  }[];
  columns: VariableColumnDataUpdate[];
  rows: VariableRowData[];
  variables: Record<string, Variable[]>;
  searchableSelectOptions?: { value: string; label: string }[];
  selectedCategory: CATEGORIES_TYPE | null;
  selectedColumn: VariableColumnDataUpdate | null;
  handleSelectColumn: (column: VariableColumnDataUpdate) => void;
  handleDeleteRow: (index: number) => void;
  handleInsertingColumn: () => void;
  handleDeleteCategoryColumn: () => void;
  handleChangeStep: ({
    rowIndex,
    edgeId
  }: {
    rowIndex: number;
    edgeId: string;
  }) => void;
  handleChangeColumnVariable: (
    newVariable: Pick<DataDictionaryVariable, 'name'>
  ) => void;
  handleSubmitVariableValue: ({
    formFieldData
  }: {
    formFieldData: SelectedCellInRowData & FormFieldsProps;
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
}

const TableSkeleton = ({
  steps,
  columns,
  rows,
  variables,
  searchableSelectOptions,
  selectedCategory,
  selectedColumn,
  handleSelectColumn,
  handleDeleteRow,
  handleInsertingColumn,
  handleDeleteCategoryColumn,
  handleChangeColumnVariable,
  handleChangeStep,
  handleSubmitVariableValue,
  handleSubmitVariableValueForEnum
}: TableSkeletonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDiaglogOpen] = useState(false);
  const [selectedRowCell, setSelectedRowCell] =
    useState<SelectedCellInRowData | null>(null);

  const handleClickOnMenu =
    (column: VariableColumnDataUpdate) =>
    (event: React.MouseEvent<HTMLElement>) => {
      handleSelectColumn(column);
      setAnchorEl(event.currentTarget);
    };

  const getColSpanLength = (category: CATEGORIES_TYPE) =>
    columns.filter((column) => column.category === category).length;

  const handleCloseMenu = () => setAnchorEl(null);
  const handleCloseDialog = () => setIsDiaglogOpen(false);

  const handleAddVariable = () => {
    setIsDiaglogOpen(true);
    handleCloseMenu();
  };

  const handleAddNewColumn = () => {
    handleInsertingColumn();
    handleCloseMenu();
  };

  const handleDeleteColumn = () => {
    handleDeleteCategoryColumn();
    handleCloseMenu();
  };

  const handleSubmitSelectedRowCellData = (
    data: SelectedCellInRowData & FormFieldsProps
  ) => {
    handleSubmitVariableValue({
      formFieldData: data
    });
    setSelectedRowCell(null);
  };

  return (
    <>
      <Table>
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
              colSpan={getColSpanLength('actions') + 2}
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
            {columns.map((column, columnIndex) => (
              <TableCell
                width={340}
                key={columnIndex}
                sx={{
                  padding: 0,
                  bgcolor: getHeaderCellBgColor(column.category)
                }}
              >
                <VariableInput
                  readOnly
                  sx={{
                    width: 300,
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                  size="small"
                  open={
                    Boolean(anchorEl) && columnIndex === selectedColumn?.index
                  }
                  value={column.name}
                  anchorEl={anchorEl}
                  handleAddVariable={handleAddVariable}
                  handleAddNewColumn={handleAddNewColumn}
                  handleDeleteColumn={handleDeleteColumn}
                  handleClickOnMenu={handleClickOnMenu(column)}
                  handleCloseMenu={handleCloseMenu}
                  isAddVariableDisabled={column.name === 'Step'}
                  isDeleteDisabled={
                    column.name === 'Step' || columns.length <= 1
                  }
                />
              </TableCell>
            ))}
            <TableCell sx={{ bgcolor: lightGreen[50] }} />
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <StyledTableRow
              key={rowIndex}
              parity={(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}
            >
              {columns.map(({ dataType, name, allowedValues }, columnIndex) => {
                if (name === 'Step') {
                  const value = steps.find(
                    (step) => step.rowIndex === rowIndex
                  )?.edgeId; // here bug because the default edge has 0 index

                  return (
                    <StyledTableCell key={columnIndex}>
                      <SelectComponent
                        fullWidth
                        value={value || ''}
                        options={searchableSelectOptions || []}
                        handleChange={(edgeId) =>
                          handleChangeStep({
                            rowIndex:
                              selectedCategory === CATEGORIES.DefaultActions
                                ? steps.length - 1
                                : rowIndex,
                            edgeId
                          })
                        }
                      />
                    </StyledTableCell>
                  );
                }

                const hasValue = row[name]?.expression || row[name]?.operator;

                const isDataTypeWithoutEnum =
                  Object.values<string>(DATA_TYPE_WITHOUT_ENUM).includes(
                    dataType
                  ) &&
                  (dataType as DATA_TYPE_WITHOUT_ENUM) !==
                    DATA_TYPE_WITHOUT_ENUM.Boolean;

                const isDataTypeWithEnum =
                  Object.values<string>(DATA_TYPE_WITH_ENUM_PREFIX).includes(
                    dataType
                  ) ||
                  (dataType as DATA_TYPE_WITHOUT_ENUM) ===
                    DATA_TYPE_WITHOUT_ENUM.Boolean;

                const enumTypeSelectOptions =
                  (dataType as DATA_TYPE_WITHOUT_ENUM) !==
                    DATA_TYPE_WITHOUT_ENUM.Boolean && allowedValues
                    ? allowedValues
                    : BOOLEAN_OPTIONS;

                return (
                  <StyledTableCell key={columnIndex}>
                    {isDataTypeWithoutEnum ? (
                      <StyledStack
                        onClick={() =>
                          setSelectedRowCell({
                            rowIndex,
                            variableName: name,
                            dataType
                          })
                        }
                        disabled={!dataType.length}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Typography variant="body2">
                          {hasValue
                            ? `${row[name].operator} ${row[name].expression}`
                            : 'Enter Condition '}
                        </Typography>
                      </StyledStack>
                    ) : null}
                    {/* Controller for the enum type of variables */}
                    {isDataTypeWithEnum && (
                      <SelectComponent
                        fullWidth
                        value={row[name].expression ?? ''}
                        options={getFormatedOptions(enumTypeSelectOptions)}
                        handleChange={(seletedValue) =>
                          handleSubmitVariableValueForEnum({
                            rowIndex,
                            variableName: name,
                            newEnumValue: seletedValue
                          })
                        }
                      />
                    )}
                  </StyledTableCell>
                );
              })}
              <StyledTableCell sx={{ padding: 0 }}>
                <Button
                  sx={{ color: theme.palette.error.main }}
                  onClick={() => handleDeleteRow(rowIndex)}
                  disabled={rows.length === 1}
                >
                  <TrashIcon />
                </Button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {selectedRowCell && selectedColumn && (
        <SelectVariableValueDialog
          modalOpen={!!selectedRowCell}
          handleClose={() => setSelectedRowCell(null)}
          selectedRowCell={selectedRowCell}
          category={selectedColumn.category} // Need to check from wich source get category
          handleSubmitSelectedRowCellData={handleSubmitSelectedRowCellData}
        />
      )}
      <DataDictionaryDialog
        data={variables}
        title={`Add ${selectedColumn?.category === CATEGORIES.Actions ? 'Input' : 'Output'} Variable`}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleChangeColumnVariable}
      />
    </>
  );
};

export default TableSkeleton;
