import { useState, useMemo, useEffect } from 'react';
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
import { getUserDefinedUsage, getUserDefinedUsageNodes } from '../utils';
import { VariableForm } from '../VariableForm/VariableForm';
import { DeleteVariable } from '../DeleteVariable/DeleteVariable';

import { StyledPaper, StyledTableContainer } from './styled';
import { TableRow } from './TableRow';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  DataDictionaryVariable,
  UserDefinedVariable,
  VariableUsageParams
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';

const TableList = ({
  flowNodes,
  tabName,
  tableData
}: {
  flowNodes: FlowNode[];
  tabName: VARIABLES_TABS;
  tableData:
    | DataDictionaryVariable[]
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >[];
}) => {
  const [selectedVariable, setSelectedVariable] = useState<
    | (Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      > & { index: number; variableIsUsed: boolean })
    | undefined
  >(undefined);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openVariableForm, setOpenVariableForm] = useState(false);
  const [deleteVariable, setDeleteVariable] = useState<
    { name: string; variableIsUsed: boolean } | undefined
  >(undefined);

  // usage for userDefined variables
  const [userDefinedUsage, setUserDefinedUsage] = useState<
    VariableUsageParams | undefined
  >(undefined);

  const { id } = useParams();

  const visibleRows = useMemo(
    () => tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, tableData]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  useEffect(() => {
    if (tabName === VARIABLES_TABS.userDefined) {
      void getUserDefinedUsage(id as string, tableData).then((data) =>
        setUserDefinedUsage(data as VariableUsageParams)
      );
    }
  }, []);

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
                flowId={id as string}
                flowNodes={flowNodes}
                // defined for userDefined variables
                userDefinedUsageNodes={
                  userDefinedUsage &&
                  getUserDefinedUsageNodes({
                    userDefinedUsage,
                    variable,
                    flowNodes
                  })
                }
                setSelectedVariable={setSelectedVariable}
                setOpenVariableForm={setOpenVariableForm}
                setDeleteVariable={setDeleteVariable}
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
        {tableData.length > 10 && (
          <TablePagination
            component="div"
            count={tableData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </StyledTableContainer>
      {openVariableForm && id && (
        <VariableForm
          flowId={id}
          modalOpen={openVariableForm}
          formData={selectedVariable}
          handleClose={() => {
            setSelectedVariable(undefined);
            setOpenVariableForm(false);
          }}
        />
      )}
      {!!deleteVariable && id && (
        <DeleteVariable
          flowId={id}
          variable={deleteVariable}
          modalOpen={!!deleteVariable}
          handleCloseModal={() => setDeleteVariable(undefined)}
        />
      )}
    </StyledPaper>
  );
};

export default TableList;