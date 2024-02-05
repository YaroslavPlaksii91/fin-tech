import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Stack,
  Box,
  IconButton,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Autocomplete,
  TextField,
  Menu,
  MenuItem,
  TableContainer,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { palette } from '../../themeConfig';

import { variablesOptions } from './constants';
import { VariablesOptionsProps } from './types';
import { StyledPaper, StyledTableContainer } from './styled';
import SelectVariableValueDialog from './SelectVariableValueDialog/SelectVariableValueDialog';

import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import {
  HexagonOutlinedIcon,
  AddIcon,
  DeleteOutlineIcon
} from '@components/shared/Icons';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';

const DecisionTableStep = ({ step }) => {
  const [columnClickedId, setColumnClickedId] = useState<string>(uuidv4());
  const [columns, setColumns] = useState([
    { id: columnClickedId, variableName: '', variableType: '' }
  ]);
  const [rows, setRows] = useState([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
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

  const handleAddNewLayer = () => {
    const newRowId = uuidv4();
    setRows([...rows, { id: newRowId }]);
  };

  const handleSubmitVariableValue = (data) => {
    console.log('handleSubmitVariableValue_in_Table', data);

    setRows(
      rows.map((row) => {
        if (row.id === data.id) {
          return {
            ...row,
            [data.variableName]: `${data.operator} ${data.variableValue}`
          };
        }
        return row;
      })
    );
  };

  const getOptions = () => {
    const columnsVariables = columns.map((column) => column.variableName);

    const newOptions = variablesOptions.filter(
      (option) => !columnsVariables.includes(option.variableName)
    );

    return newOptions;
  };

  return (
    <>
      <StepDetailsHeader
        title={step.data.name}
        details="A decision table is an object that allows to set expressions for
        columns and rows. The system will go through the table and analyze the
        values."
      />
      <StyledPaper>
        <StyledTableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell
                  align="center"
                  colSpan={2}
                  sx={{ backgroundColor: palette.lightGray }}
                >
                  Condition
                </StyledTableCell>
              </StyledTableRow>
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
                        sx={{ width: 250 }}
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
                        renderInput={(params) => (
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
                                    aria-controls={
                                      open ? 'long-menu' : undefined
                                    }
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
                                          onClick={() =>
                                            handleAddNewColumn(index)
                                          }
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
                <StyledTableRow
                  key={row.id}
                  // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  {columns.map((column, index) => (
                    <StyledTableCell key={index}>
                      {(column.variableType === 'string' ||
                        column.variableType === 'number') && (
                        <Stack
                          onClick={() =>
                            setSelectedRowData({
                              ...row,
                              variableName: column.variableName,
                              variableType: column.variableType,
                              variableValue: '',
                              operator: ''
                            })
                          }
                          disabled={!column.variableType.length}
                          sx={{ cursor: 'pointer' }}
                        >
                          {!!row[column.variableName] ? (
                            <Stack>{row[column.variableName]}</Stack>
                          ) : (
                            <Typography variant="body2">
                              Select value
                            </Typography>
                          )}
                        </Stack>
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>

      <Button
        sx={{ width: '135px' }}
        onClick={() => handleAddNewLayer()}
        startIcon={<AddIcon />}
      >
        <Typography variant="body2" color={palette.gray}>
          Add new layer
        </Typography>
      </Button>
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

export default DecisionTableStep;
