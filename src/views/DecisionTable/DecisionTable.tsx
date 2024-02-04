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
  TableContainer
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { palette } from '../../themeConfig';

import SelectVariableValueDialog from './SelectVariableValueDialog';

import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { HexagonOutlinedIcon } from '@components/shared/Icons';

type OptionProps = {
  variableName: string;
  variableType: string;
};

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

  const options: OptionProps[] = [
    { variableName: 'LeadSourse1', variableType: 'string' },
    { variableName: 'LeadSourse2', variableType: 'string' },
    { variableName: 'LeadSourse3', variableType: 'string' },
    { variableName: 'LeadSourse4', variableType: 'string' },
    { variableName: 'LeadSourse5', variableType: 'string' },
    { variableName: 'LeadPrice', variableType: 'number' },
    { variableName: 'CRA.Claritties.Score', variableType: 'number' }
  ];

  const getOptions = () => {
    const columnsVariables = columns.map((column) => column.variableName);

    const newOptions = options.filter(
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

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell
                align="center"
                colSpan={2}
                sx={{ backgroundColor: palette.lightGray }}
              >
                Condition
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={column.id}>
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
                      getOptionLabel={(option: OptionProps) =>
                        option ? option.variableName : ''
                      }
                      onChange={(e, newValue: OptionProps) => {
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
                        <TextField {...params} label="Choose the variable" />
                      )}
                    />
                    <Box>
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

                            <MenuItem onClick={() => handleAddNewColumn(index)}>
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

                                // console.log('newColumns', newColumns);

                                setColumns(newColumns);
                                handleCloseMenu();
                              }}
                            >
                              Delete Column
                            </MenuItem>
                          </Stack>
                        </Stack>
                      </Menu>
                    </Box>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {columns.map((column, index) => (
                  <TableCell key={index}>
                    {(column.variableType === 'string' ||
                      column.variableType === 'number') && (
                      <TextField
                        variant="outlined"
                        type="text"
                        value=""
                        placeholder="Select value"
                        onClick={() =>
                          setSelectedRowData({
                            ...row,
                            variableName: column.variableName,
                            variableType: column.variableType,
                            variableValue: '',
                            operator: ''
                          })
                        }
                      />
                    )}
                    {/* {col.type === 'select' && (
                        <select
                          value={row[col.key]}
                          style={{ width: '150px' }}
                        />
                      )} */}

                    {!column.variableType.length && (
                      <TextField
                        variant="outlined"
                        type="text"
                        disabled={!column.variableType.length}
                        value=""
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button onClick={() => handleAddNewLayer()}>Add new layer</Button>
      {selectedRowData && (
        <SelectVariableValueDialog
          modalOpen={!!selectedRowData}
          handleClose={() => setSelectedRowData(null)}
          selectedRowData={selectedRowData}
          handleSubmitVariableValue={() => {}}
        />
      )}
    </>
  );
};

export default DecisionTableStep;
