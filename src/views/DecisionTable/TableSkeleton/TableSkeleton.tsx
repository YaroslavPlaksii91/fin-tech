import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Stack,
  Box,
  IconButton,
  TableBody,
  TableHead,
  Autocomplete,
  Menu,
  MenuItem,
  Typography,
  Select
} from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { StyledTable } from './styled';
import { OPERATORS, CATEGORIES, VARIABLE_TYPE } from '../constants';
import { VariablesOptionsProps, SelectedRowDataProps } from '../types';

import SelectVariableValueDialog from '../SelectVariableValueDialog/SelectVariableValueDialog';

import {
  HexagonOutlinedIcon,
  DeleteOutlineIcon
} from '@components/shared/Icons';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';

const TableSkeleton = ({
  columns,
  setColumns,
  rows,
  setRows,
  variablesOptions,
  columnClickedId,
  setColumnClickedId,
  category,
  handleDeleteRow
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowData, setSelectedRowData] =
    useState<SelectedRowDataProps | null>(null);
  const open = Boolean(anchorEl);

  const handleClickOnMenu = (
    event: React.MouseEvent<HTMLElement>,
    columnClickedIdNew: string
  ) => {
    setAnchorEl(event.currentTarget);
    setColumnClickedId(columnClickedIdNew);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleAddNewColumn = (columnClickedIndex: number) => {
    const newColumns = [...columns];
    newColumns.splice(columnClickedIndex + 1, 0, {
      id: uuidv4(),
      variableName: '',
      variableType: ''
    });
    setColumns(newColumns);
    handleCloseMenu();
  };

  const handleSubmitVariableValue = (data: SelectedRowDataProps) => {
    console.log('handleSubmitVariableValue_in_Table', data);
    const { id, variableName, operator, value, lowestValue, highestValue } =
      data;

    setRows(
      rows.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            [variableName]:
              operator === OPERATORS.Between
                ? `${operator} ${lowestValue} and ${highestValue}`
                : `${operator} ${value}`
          };
        }
        return row;
      })
    );
    setSelectedRowData(null);
  };

  const getOptions = () => {
    const columnsVariables = columns.map((column) => column.variableName);

    const newOptions = variablesOptions.filter(
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
            {columns.map((column, index) => (
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
                      minWidth: 250,
                      '& .MuiInputBase-root': {
                        height: '50px'
                      }
                    }}
                    value={column}
                    disableClearable={true}
                    forcePopupIcon={false}
                    getOptionLabel={(option: VariablesOptionsProps) =>
                      option ? option.variableName : ''
                    }
                    onChange={(e, newValue: VariablesOptionsProps) => {
                      setColumns(
                        columns.map((item) => {
                          if (item.id === column.id) {
                            return {
                              ...item,
                              variableName: newValue.variableName,
                              variableType: newValue.variableType
                            };
                          } else {
                            return item;
                          }
                        })
                      );
                    }}
                    renderInput={(params: TextFieldProps) => (
                      <TextField
                        {...params}
                        placeholder="Choose the variable"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(event: any) =>
                                  handleClickOnMenu(event, column.id)
                                }
                              >
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                id="long-menu"
                                anchorEl={anchorEl}
                                open={open && column.id === columnClickedId}
                                onClose={handleCloseMenu}
                                PaperProps={{
                                  style: {
                                    width: '20ch'
                                  }
                                }}
                              >
                                <Stack
                                  key="add-column-action"
                                  justifyContent="center"
                                  alignItems="flex-start"
                                  spacing={1}
                                  sx={{
                                    padding: '0 8px'
                                  }}
                                >
                                  <Stack
                                    flexDirection="row"
                                    alignItems="center"
                                    spacing={0.5}
                                  >
                                    <HexagonOutlinedIcon size="16px" />

                                    <MenuItem
                                      onClick={() => handleAddNewColumn(index)}
                                    >
                                      Add Column
                                    </MenuItem>
                                  </Stack>
                                  <Stack
                                    key="delete-column-action"
                                    flexDirection="row"
                                    alignItems="center"
                                    spacing={0.5}
                                  >
                                    <HexagonOutlinedIcon size="16px" />

                                    <MenuItem
                                      onClick={() => {
                                        const newColumns = columns.filter(
                                          (item) => item.id !== column.id
                                        );

                                        setColumns(newColumns);
                                        handleCloseMenu();
                                      }}
                                    >
                                      Delete Column
                                    </MenuItem>
                                  </Stack>
                                </Stack>
                              </Menu>
                            </>
                          )
                        }}
                      />
                    )}
                  />
                </Box>
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id} sx={{ height: '62px' }}>
              {columns.map((column, index) => (
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
                      {!!row[column.variableName] ? (
                        <Stack>{row[column.variableName]}</Stack>
                      ) : (
                        <Typography variant="body2">Select value</Typography>
                      )}
                    </Stack>
                  )}
                  {/* mock only for dicision type */}
                  {column.variableType === VARIABLE_TYPE.Enum && (
                    <Select fullWidth size="small">
                      <MenuItem key="accept-action" value="Accept">
                        Accept
                      </MenuItem>
                      <MenuItem key="accept-denied" value="Denied">
                        Denied
                      </MenuItem>
                    </Select>
                  )}
                </StyledTableCell>
              ))}
              {category === CATEGORIES.Output && !!rows.length && (
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
          handleSubmitVariableValue={handleSubmitVariableValue}
        />
      )}
    </>
  );
};

export default TableSkeleton;
