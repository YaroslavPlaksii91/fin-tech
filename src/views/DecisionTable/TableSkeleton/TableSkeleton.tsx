import { useState, SyntheticEvent } from 'react';
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

import { CATEGORIES } from '../constants';
import { VariableRowData, VariableHeaderData } from '../types';
import SelectVariableValueDialog from '../Forms/SelectVariableValueDialog';
import { AutocompleteInput } from '../AutocompleteInput/AutocompleteInput';

import { StyledTable, StyledStack } from './styled';

import { DeleteOutlineIcon } from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import SelectComponent from '@components/shared/SelectComponent/SelectComponent';
import {
  DataDictionaryVariable,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX
} from '@domain/dataDictionary';

type TableSkeletonProps = {
  columns: VariableHeaderData[];
  rows: VariableRowData[];
  variablesOptions: DataDictionaryVariable[];
  columnClickedId?: string;
  category: CATEGORIES;
  handleDeleteRow?: (id: string) => void;
  handleChangeColumnClickedId?: (id: string, category: CATEGORIES) => void;
  handleInsertingColumn?: ({
    columnClickedIndex,
    category
  }: {
    columnClickedIndex: number;
    category: CATEGORIES;
  }) => void;
  handleDeleteCategoryColumn?: ({
    columnId,
    category
  }: {
    columnId: string;
    category: CATEGORIES;
  }) => void;
  handleChangeColumnVariable?: ({
    columnId,
    newVariable,
    category
  }: {
    columnId: string;
    newVariable: Omit<
      DataDictionaryVariable,
      'defaultValue' | 'isRequired' | 'usageMode' | 'description'
    >;
    category: CATEGORIES;
  }) => void;
  handleSubmitVariableValue: ({
    newVariableValue,
    category
  }: {
    newVariableValue: VariableRowData;
    category: CATEGORIES;
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
    useState<VariableRowData | null>(null);

  const open = Boolean(anchorEl);
  const isTheLastCategoryColumn = columns.length <= 1;

  const handleClickOnMenu = (
    event: React.MouseEvent<HTMLElement>,
    columnClickedIdNew: string
  ) => {
    setAnchorEl(event.currentTarget);

    handleChangeColumnClickedId?.(columnClickedIdNew, category);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddNewColumn = (columnClickedIndex: number) => {
    handleInsertingColumn?.({ columnClickedIndex, category });
    handleCloseMenu();
  };

  const handleDeleteColumn = (columnId: string) => {
    handleDeleteCategoryColumn?.({ columnId, category });
    handleCloseMenu();
  };

  const handleSubmitSelectedRowData = (data: VariableRowData) => {
    handleSubmitVariableValue({ newVariableValue: data, category });
    setSelectedRowData(null);
  };

  const getOptions = () => {
    const columnsVariables = columns.map(
      (column: VariableHeaderData) => column.variableName
    );

    const newOptions: DataDictionaryVariable[] = variablesOptions.filter(
      (option: DataDictionaryVariable) =>
        !columnsVariables.includes(option.variableName)
    );

    return newOptions;
  };

  return (
    <>
      <StyledTable sx={{ minWidth: 650 }}>
        <TableHead>
          <StyledTableRow>
            {columns.map((column: VariableHeaderData, index: number) => (
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
                    getOptionLabel={(
                      option: Omit<
                        DataDictionaryVariable,
                        | 'defaultValue'
                        | 'isRequired'
                        | 'usageMode'
                        | 'description'
                      >
                    ) => (option ? option.variableName : '')}
                    onChange={(
                      event: SyntheticEvent<Element, Event>,
                      newValue: Omit<
                        DataDictionaryVariable,
                        | 'defaultValue'
                        | 'isRequired'
                        | 'usageMode'
                        | 'description'
                      >
                    ) => {
                      event &&
                        handleChangeColumnVariable?.({
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
                        isTheLastCategoryColumn={isTheLastCategoryColumn}
                      />
                    )}
                  />
                </Box>
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: VariableRowData) => (
            <StyledTableRow key={row.id} sx={{ height: '62px' }}>
              {columns.map((column: VariableHeaderData, index: number) => (
                <StyledTableCell key={index}>
                  {Object.values(DATA_TYPE_WITHOUT_ENUM).includes(
                    column.dataType as DATA_TYPE_WITHOUT_ENUM
                  ) && (
                    <StyledStack
                      onClick={() =>
                        setSelectedRowData({
                          ...row,
                          variableName: column.variableName,
                          variableType: column.dataType
                        })
                      }
                      disabled={!column.dataType.length}
                      sx={{ cursor: 'pointer' }}
                    >
                      {row[column.variableName as keyof VariableRowData] ? (
                        <Stack>
                          {row[column.variableName as keyof VariableRowData]}
                        </Stack>
                      ) : (
                        <Typography variant="body2">Select value</Typography>
                      )}
                    </StyledStack>
                  )}

                  {Object.values(DATA_TYPE_WITH_ENUM_PREFIX).includes(
                    column.dataType as DATA_TYPE_WITH_ENUM_PREFIX
                  ) && (
                    <SelectComponent
                      options={column.allowedValues}
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
                    onClick={() => handleDeleteRow?.(row.id)}
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
          handleSubmitSelectedRowData={handleSubmitSelectedRowData}
        />
      )}
    </>
  );
};

export default TableSkeleton;
