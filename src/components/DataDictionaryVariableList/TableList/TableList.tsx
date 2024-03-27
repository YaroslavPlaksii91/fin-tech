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
import { DeleteVariable } from '../DeleteVariable/DeleteVariable';

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
import { FlowNode } from '@domain/flow';

const TableList = ({
  flowNodes,
  tabName,
  tableList,
  setTableList
}: {
  flowNodes: FlowNode[];
  tabName: VARIABLES_TABS;
  tableList:
    | DataDictionaryVariable[]
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >[];
  setTableList: (list: UserDefinedVariable[]) => void;
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
      {openVariableForm && id && (
        <VariableForm
          flowId={id}
          modalOpen={openVariableForm}
          formData={selectedVariable}
          handleClose={() => {
            setSelectedVariable(undefined);
            setOpenVariableForm(false);
          }}
          setTableList={setTableList}
        />
      )}
      {!!deleteVariable && id && (
        <DeleteVariable
          flowId={id}
          variable={deleteVariable}
          tableList={tableList}
          modalOpen={!!deleteVariable}
          handleCloseModal={() => setDeleteVariable(undefined)}
          setTableList={setTableList}
        />
      )}
    </StyledPaper>
  );
};

export default TableList;
