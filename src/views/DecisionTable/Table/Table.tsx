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
  ColumnData,
  OPERATORS,
  CATEGORY,
  CaseEntry
} from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
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
  columns: ColumnData[];
  rows: CaseEntry[];
  variables: Record<string, Variable[]>;
  integrationData: Record<string, Variable[]>;
  stepOptions: { value: string; label: string }[];
  handleDeleteRow: (index: number) => void;
  handleAddColumn: (column: ColumnData) => void;
  handleDeleteColumn: (column: ColumnData) => void;
  handleChangeStep: (rowIndex: number, stepId: string) => void;
  handleChangeColumn: (
    column: ColumnData,
    variable: DataDictionaryVariable
  ) => void;
  handleEntryChange: (
    data: FormFieldsProps,
    selectedCell: SelectedCell
  ) => void;
  hasUserPermission: boolean;
}

const Table = ({
  hasUserPermission,
  stepIds,
  columns,
  rows,
  variables,
  integrationData,
  stepOptions,
  handleDeleteRow,
  handleAddColumn,
  handleDeleteColumn,
  handleChangeColumn,
  handleChangeStep,
  handleEntryChange
}: Table) => {
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);

  const getColSpanLength = (category: CATEGORY) =>
    columns.filter((column) => column.category === category).length;

  const handleSubmitSelectedCellData = (data: FormFieldsProps) => {
    if (!selectedCell) return;

    handleEntryChange(data, selectedCell);
    setSelectedCell(null);
  };

  const handleCellClick = (data: SelectedCell) => () => {
    if (!hasUserPermission) return;

    setSelectedCell(data);
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
          <VariablesRow
            hasUserPermission={hasUserPermission}
            columns={columns}
            variables={variables}
            integrationData={integrationData}
            handleChangeColumn={handleChangeColumn}
            handleAddColumn={handleAddColumn}
            handleDeleteColumn={handleDeleteColumn}
          />
          {rows.map((row, rowIndex) => (
            <StyledTableRow
              key={rowIndex}
              parity={rowIndex % 2 === 0 ? 'even' : 'odd'}
            >
              {columns.map((column, columnIndex) => {
                const entry = row[column.category][column.index];

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
                      <StyledTableCell>
                        {rows.length !== rowIndex + 1 && hasUserPermission ? (
                          <Button
                            fullWidth
                            sx={{ color: theme.palette.error.main, padding: 0 }}
                            onClick={() => handleDeleteRow(rowIndex)}
                          >
                            <TrashIcon />
                          </Button>
                        ) : null}
                      </StyledTableCell>
                    </Fragment>
                  );
                }

                if (columnIndex === 0 && rows.length - 1 === rowIndex)
                  return (
                    <StyledTableCell key={columnIndex}>Else</StyledTableCell>
                  );
                if (
                  (rows.length - 1 === rowIndex &&
                    column.category === 'conditions') ||
                  !entry?.name
                )
                  return <StyledTableCell key={columnIndex} />;

                const hasValue =
                  Boolean(entry.expression) || Boolean(entry.operator);

                return (
                  <StyledTableCell
                    sx={{ cursor: hasUserPermission ? 'pointer' : 'default' }}
                    key={columnIndex}
                    onClick={handleCellClick({
                      ...column,
                      ...entry,
                      columnIndex: column.index,
                      rowIndex
                    })}
                  >
                    <Typography variant="body2">
                      {hasValue
                        ? `${column.category === 'conditions' ? entry.operator : OPERATORS.EQUAL} ${entry.expression}`
                        : `Enter ${column.category === 'conditions' ? 'Condition' : 'Value'}`}
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
          isCondition={selectedCell.category === 'conditions'}
          modalOpen={Boolean(selectedCell)}
          handleClose={() => setSelectedCell(null)}
          selectedCell={selectedCell}
          handleSubmitForm={handleSubmitSelectedCellData}
          variables={variables}
          integrationData={integrationData}
        />
      )}
    </>
  );
};

export default Table;
