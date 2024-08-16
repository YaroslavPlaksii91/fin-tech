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

import { STEP } from '../constants';
import {
  SelectedCell,
  FormFieldsProps,
  VariableColumnData,
  CaseEntry,
  OPERATORS,
  CATEGORIES,
  CATEGORY
} from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
import { checkDataType, removeExtraDoubleQuotes } from '../utils';
import Select from '../Select';

import { Head, StyledTableBody } from './styled';
import VariablesRow from './VariablesRow';

import { theme } from '@theme';
import TrashIcon from '@icons/trash.svg';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import { DataDictionaryVariable, Variable } from '@domain/dataDictionary';

interface Table {
  stepIds: (string | null)[];
  columns: VariableColumnData[];
  rows: Record<string, CaseEntry>[];
  variables: Record<string, Variable[]>;
  integrationData: Record<string, Variable[]>;
  stepOptions: { value: string; label: string }[];
  handleDeleteRow: (index: number) => void;
  handleAddColumn: (column: VariableColumnData) => void;
  handleDeleteColumn: (column: VariableColumnData) => void;
  handleChangeStep: (rowIndex: number, stepId: string) => void;
  handleChangeColumnVariable: (
    column: VariableColumnData
  ) => (newVariable: DataDictionaryVariable) => void;
  handleSubmitVariableValue: (
    data: FormFieldsProps,
    category: CATEGORY,
    index: number
  ) => void;
  hasUserPermission: boolean;
}

const Table = ({
  stepIds,
  columns,
  rows,
  variables,
  integrationData,
  stepOptions,
  handleDeleteRow,
  handleAddColumn,
  handleDeleteColumn,
  handleChangeColumnVariable,
  handleChangeStep,
  handleSubmitVariableValue,
  hasUserPermission
}: Table) => {
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  const getColSpanLength = (category: CATEGORY) =>
    columns.filter((column) => column.category === category).length;

  const handleSubmitSelectedCellData = (data: FormFieldsProps) => {
    if (!selectedCell) return;

    handleSubmitVariableValue(
      data,
      selectedCell.category,
      selectedCell.rowIndex
    );
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
          <VariablesRow
            hasUserPermission={hasUserPermission}
            columns={columns}
            variables={variables}
            integrationData={integrationData}
            handleChangeColumnVariable={handleChangeColumnVariable}
            handleAddColumn={handleAddColumn}
            handleDeleteColumn={handleDeleteColumn}
          />
          {rows.map((row, rowIndex) => (
            <StyledTableRow
              key={rowIndex}
              parity={(rowIndex + 1) % 2 === 0 ? 'even' : 'odd'}
            >
              {columns.map((column, columnIndex) => {
                const dataType = checkDataType(column.dataType);
                const caseEntry = row[column.name];

                if (column.name === STEP) {
                  return (
                    <Fragment key={columnIndex}>
                      <StyledTableCell>
                        <Select
                          fullWidth
                          placeholder="Select next step"
                          value={stepIds[rowIndex] || ''}
                          options={stepOptions}
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

                if (!caseEntry?.name)
                  return (
                    <StyledTableCell key={columnIndex}>
                      {rows.length - 1 === rowIndex && columnIndex === 0
                        ? 'Else'
                        : ''}
                    </StyledTableCell>
                  );

                const hasValue =
                  Boolean(caseEntry.expression) || Boolean(caseEntry.operator);

                const expression = dataType.isString
                  ? removeExtraDoubleQuotes(caseEntry.expression)
                  : caseEntry.expression;

                return (
                  <StyledTableCell
                    sx={{ cursor: hasUserPermission ? 'pointer' : 'default' }}
                    key={columnIndex}
                    onClick={() => {
                      hasUserPermission &&
                        setSelectedCell({
                          ...caseEntry,
                          rowIndex,
                          expression,
                          category: column.category,
                          dataType: column.dataType,
                          allowedValues: column.allowedValues
                        });
                    }}
                  >
                    <Typography variant="body2">
                      {hasValue
                        ? `${column.category === CATEGORIES.Conditions ? caseEntry.operator : OPERATORS.EQUAL} ${expression}`
                        : `Enter ${column.category === CATEGORIES.Conditions ? 'Condition' : 'Value'}`}
                    </Typography>
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
          isCondition={selectedCell.category === CATEGORIES.Conditions}
          modalOpen={!!selectedCell}
          handleClose={() => setSelectedCell(null)}
          selectedCell={selectedCell}
          handleSubmitForm={handleSubmitSelectedCellData}
        />
      )}
    </>
  );
};

export default Table;
