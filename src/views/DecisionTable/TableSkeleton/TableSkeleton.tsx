import { useState } from 'react';
import {
  Button,
  Stack,
  Box,
  TableBody,
  TableHead,
  Autocomplete,
  Typography
} from '@mui/material';
import { TextFieldProps } from '@mui/material/TextField';

import { CATEGORIES, VARIABLE_TYPE, DECISION_OPTIONS } from '../constants';
import {
  VariablesOptionsProps,
  VariableValueDataProps,
  VariableTypeDataProps
} from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
import { AutocompleteInput } from '../AutocompleteInput/AutocompleteInput';

import { StyledTable } from './styled';

import { DeleteOutlineIcon } from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import SelectComponent from '@components/shared/SelectComponent/SelectComponent';

type TableSkeletonProps = {
  columns: VariableTypeDataProps[];
  rows: VariableValueDataProps[];
  variablesOptions: VariablesOptionsProps[];
  columnClickedId: string;
  category: string;
  handleDeleteRow: (id: string) => void;
  handleChangeColumnClickedId: (id: string, category: string) => void;
  handleInsertingColumn: ({
    columnClickedIndex,
    category
  }: {
    columnClickedIndex: number;
    category: string;
  }) => void;
  handleDeleteCategoryColumn: ({
    columnId,
    category
  }: {
    columnId: string;
    category: string;
  }) => void;
  handleChangeColumnVariable: ({
    columnId,
    newVariable,
    category
  }: {
    columnId: string;
    newVariable: VariablesOptionsProps;
    category: string;
  }) => void;
  handleSubmitVariableValue: ({
    newVariableValue,
    category
  }: {
    newVariableValue: VariableValueDataProps;
    category: string;
  }) => void;
};

const TableSkeleton = ({
  columns,
  rows,
  variablesOptions,
  columnClickedId,
  category,
  handleDeleteRow,
  handleChangeColumnClickedId,
  handleInsertingColumn,
  handleDeleteCategoryColumn,
  handleChangeColumnVariable,
  handleSubmitVariableValue
}: TableSkeletonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowData, setSelectedRowData] =
    useState<VariableValueDataProps | null>(null);

  const [selectedEnumOptions, setSelectedEnumOptions] = useState({
    decision: ''
  });
  const open = Boolean(anchorEl);

  const handleClickOnMenu = (
    event: React.MouseEvent<HTMLElement>,
    columnClickedIdNew: string
  ) => {
    setAnchorEl(event.currentTarget);

    handleChangeColumnClickedId(columnClickedIdNew, category);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddNewColumn = (columnClickedIndex: number) => {
    handleInsertingColumn({ columnClickedIndex, category });
    handleCloseMenu();
  };

  const handleDeleteColumn = (columnId: string) => {
    handleDeleteCategoryColumn({ columnId, category });
    handleCloseMenu();
  };

  const handleSubmitSelectedRowData = (data: VariableValueDataProps) => {
    handleSubmitVariableValue({ newVariableValue: data, category });
    setSelectedRowData(null);
  };

  const handleChangeOptionForEnum = (category: string, value: string) => {
    setSelectedEnumOptions((current) => ({
      ...current,
      [category]: value
    }));
  };

  const getOptions = () => {
    const columnsVariables = columns.map(
      (column: VariableTypeDataProps) => column.variableName
    );

    const newOptions: VariablesOptionsProps[] = variablesOptions.filter(
      (option: VariablesOptionsProps) =>
        !columnsVariables.includes(option.variableName)
    );

    return newOptions;
  };

  return (
    <>
      <StyledTable sx={{ minWidth: 650 }}>
        <TableHead>
          <StyledTableRow>
            {columns.map((column: VariableTypeDataProps, index: number) => (
              <StyledTableCell key={column.id}>
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
                    getOptionLabel={(option: VariablesOptionsProps) =>
                      option ? option.variableName : ''
                    }
                    onChange={(
                      event: Event,
                      newValue: VariablesOptionsProps
                    ) => {
                      event &&
                        handleChangeColumnVariable({
                          columnId: column.id,
                          newVariable: newValue,
                          category
                        });
                    }}
                    renderInput={(params: TextFieldProps) => (
                      <AutocompleteInput
                        {...params}
                        open={open}
                        columnId={column.id}
                        columnClickedId={columnClickedId}
                        anchorEl={anchorEl}
                        index={index}
                        category={category}
                        handleAddNewColumn={handleAddNewColumn}
                        handleDeleteColumn={handleDeleteColumn}
                        handleClickOnMenu={handleClickOnMenu}
                        handleCloseMenu={handleCloseMenu}
                      />
                    )}
                  />
                </Box>
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: VariableValueDataProps) => (
            <StyledTableRow key={row.id} sx={{ height: '62px' }}>
              {columns.map((column: VariableTypeDataProps, index: number) => (
                <StyledTableCell key={index}>
                  {(column.variableType === VARIABLE_TYPE.String ||
                    column.variableType === VARIABLE_TYPE.Number) && (
                    <Stack
                      onClick={() =>
                        setSelectedRowData({
                          ...row,
                          variableName: column.variableName,
                          variableType: column.variableType,
                          value: '',
                          operator: '',
                          lowestValue: '',
                          highestValue: ''
                        })
                      }
                      disabled={!column.variableType.length}
                      sx={{ cursor: 'pointer' }}
                    >
                      {row[column.variableName] ? (
                        <Stack>{row[column.variableName]}</Stack>
                      ) : (
                        <Typography variant="body2">Select value</Typography>
                      )}
                    </Stack>
                  )}
                  {/* mock only for dicision type */}

                  {column.variableType === VARIABLE_TYPE.Enum && (
                    <SelectComponent
                      value={selectedEnumOptions.decision}
                      onChange={handleChangeOptionForEnum}
                      options={DECISION_OPTIONS}
                      name="decision"
                      fullWidth
                    />
                  )}
                </StyledTableCell>
              ))}
              {category === CATEGORIES.Actions && !!rows.length && (
                <StyledTableCell sx={{ padding: 0 }} width={40}>
                  <Button
                    fullWidth
                    sx={{ padding: '10px' }}
                    onClick={() => handleDeleteRow(row.id)}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </StyledTableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>

      {selectedRowData && (
        <SelectVariableValueDialog
          modalOpen={!!selectedRowData}
          handleClose={() => setSelectedRowData(null)}
          selectedRowData={selectedRowData}
          category={category}
          handleSubmitVariableValue={handleSubmitSelectedRowData}
        />
      )}
    </>
  );
};

export default TableSkeleton;
