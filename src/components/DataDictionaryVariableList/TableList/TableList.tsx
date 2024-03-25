import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  TableHead,
  TableBody,
  IconButton,
  TablePagination,
  Divider,
  Table
} from '@mui/material';
import { AddBoxOutlined } from '@mui/icons-material';

import { VARIABLES_TABS } from '../constants';
import { VariableForm } from '../VariableForm/VariableForm';

import { StyledPaper, StyledTableContainer } from './styled';
import { TableRow } from './TableRow';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';
import { JSONPatchOperation } from '@domain/entity';
import { FlowNode } from '@domain/flow';
import { flowService } from '@services/flow-service';
import Logger from '@utils/logger';

const TableList = ({
  data,
  flowNodes,
  tabName
}: {
  data: DataDictionaryVariable[] | UserDefinedVariable[];
  flowNodes: FlowNode[];
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
              <StyledTableCell></StyledTableCell>
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
              <TableRow
                key={index}
                row={variable}
                index={index}
                tabName={tabName}
                tableList={tableList}
                flowNodes={flowNodes}
                setTableList={setTableList}
                setSelectedVariable={setSelectedVariable}
                setOpenVariableForm={setOpenVariableForm}
              />
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
