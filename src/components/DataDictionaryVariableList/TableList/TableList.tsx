import { useState, useMemo } from 'react';
import { indexOf, map } from 'lodash';
import { useParams } from 'react-router-dom';
import {
  TableHead,
  TableBody,
  IconButton,
  TablePagination,
  Divider,
  Stack,
  Button,
  Table
} from '@mui/material';
import AddBoxOutlined from '@mui/icons-material/AddBoxOutlined';

import { VARIABLES_TABS } from '../constants';
import { VariableForm } from '../VariableForm/VariableForm';

import { StyledPaper, StyledTableContainer } from './styled';

import {
  DeleteOutlineIcon,
  EditNoteOutlinedIcon
} from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';
import { JSONPatchOperation } from '@domain/entity';
import { flowService } from '@services/flow-service';
import Logger from '@utils/logger';

const TableList = ({
  data,
  tabName
}: {
  data: DataDictionaryVariable[] | UserDefinedVariable[];
  tabName: VARIABLES_TABS;
}) => {
  const [tableList, setTableList] = useState<
    | DataDictionaryVariable[]
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >[]
  >(data ?? []);

  const [selectedVariable, setSelectedVariable] = useState<
    | (Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      > & { index: number })
    | undefined
  >(undefined);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openVariableForm, setOpenVariableForm] = useState(false);

  const { id } = useParams();

  const visibleRows = useMemo(
    () => tableList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, tableList]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableList.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    event && setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitVariableFormData = async (
    newVariable: Pick<
      UserDefinedVariable,
      'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
    >
  ) => {
    let operations: JSONPatchOperation[];

    if (selectedVariable) {
      // operations to update variable
      operations = [
        {
          value: newVariable,
          path: `/temporaryVariables/${selectedVariable.index}`,
          op: 'replace'
        }
      ];
    } else {
      // Patch operations to add variable
      operations = [
        {
          value: newVariable,
          path: '/temporaryVariables/-',
          op: 'add'
        }
      ];
    }

    try {
      const resultData = id && (await flowService.updateFlow(id, operations));
      resultData &&
        setTableList([
          ...(resultData?.temporaryVariables as UserDefinedVariable[]),
          ...(resultData.permanentVariables as UserDefinedVariable[])
        ]);
    } catch (error) {
      Logger.error('Error updating temporary variables in the flow:', error);
    }

    setSelectedVariable(undefined);
    setOpenVariableForm(false);
  };

  return (
    <StyledPaper>
      <StyledTableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell style={{ width: '20%' }}>
                Variable Name
              </StyledTableCell>
              <StyledTableCell> Data Type</StyledTableCell>
              <StyledTableCell style={{ width: '20%' }}>
                Default value
              </StyledTableCell>
              <StyledTableCell> Description</StyledTableCell>
              {tabName === VARIABLES_TABS.userDefined && (
                <StyledTableCell align="right">
                  <IconButton
                    onClick={() => {
                      setSelectedVariable(undefined);
                      setOpenVariableForm(true);
                    }}
                    edge="end"
                    aria-label="add"
                    sx={{ padding: 0, marginRight: 0 }}
                  >
                    <AddBoxOutlined fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              )}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((variable, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{variable.name}</StyledTableCell>
                <StyledTableCell>{variable.dataType}</StyledTableCell>
                <StyledTableCell>{variable.defaultValue}</StyledTableCell>
                <StyledTableCell>{variable.description}</StyledTableCell>
                {tabName === VARIABLES_TABS.userDefined && (
                  <StyledTableCell align="right" sx={{ padding: 0 }} width={70}>
                    <Stack direction="row" sx={{ maxWidth: '0px' }}>
                      <Button
                        onClick={() => {
                          const indexOfVariable = indexOf(
                            map(tableList, 'name'),
                            variable.name
                          );

                          setSelectedVariable({
                            index: indexOfVariable,
                            ...variable
                          });
                          setOpenVariableForm(true);
                        }}
                      >
                        <EditNoteOutlinedIcon />
                      </Button>
                      <Button
                        sx={{}}
                        onClick={async () => {
                          const operations: JSONPatchOperation[] = [
                            {
                              path: `/temporaryVariables/${indexOf(
                                map(tableList, 'name'),
                                variable.name
                              )}`,
                              op: 'remove'
                            }
                          ];

                          try {
                            const resultData =
                              id &&
                              (await flowService.updateFlow(id, operations));

                            resultData &&
                              setTableList([
                                ...(resultData?.temporaryVariables as UserDefinedVariable[]),
                                ...(resultData.permanentVariables as UserDefinedVariable[])
                              ]);
                          } catch (error) {
                            Logger.error(
                              'Error deleting temporary variables in the flow:',
                              error
                            );
                          }
                        }}
                      >
                        <DeleteOutlineIcon />
                      </Button>
                    </Stack>
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <StyledTableRow
                style={{
                  height: 43 * emptyRows
                }}
              >
                <StyledTableCell colSpan={6} />
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
        <Divider />
        {tableList.length > 10 && (
          <TablePagination
            component="div"
            count={tableList.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </StyledTableContainer>
      {openVariableForm && (
        <VariableForm
          title="Create variable"
          modalOpen={openVariableForm}
          formData={selectedVariable}
          handleSubmitVariableFormData={handleSubmitVariableFormData}
          handleClose={() => {
            setSelectedVariable(undefined);
            setOpenVariableForm(false);
          }}
        />
      )}
    </StyledPaper>
  );
};

export default TableList;
