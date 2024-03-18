import { useState, useMemo } from 'react';
import {
  TableHead,
  TableBody,
  IconButton,
  TablePagination,
  Divider
} from '@mui/material';
import AddBoxOutlined from '@mui/icons-material/AddBoxOutlined';

import { VARIABLES_TABS } from '../constants';
import { VariableForm } from '../VariableForm/VariableForm';

import { StyledPaper, StyledTableContainer, StyledTable } from './styled';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';

const TableList = ({
  data,
  tabName
}: {
  data: DataDictionaryVariable[] | UserDefinedVariable[];
  tabName: VARIABLES_TABS;
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openVariableForm, setOpenVariableForm] = useState(false);

  const visibleRows = useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

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
        <StyledTable>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell> Variable Name</StyledTableCell>
              <StyledTableCell> Data Type</StyledTableCell>
              <StyledTableCell> Default value</StyledTableCell>
              <StyledTableCell> Description</StyledTableCell>
              {tabName !== VARIABLES_TABS.laPMSVariables && (
                <StyledTableCell align="right">
                  <IconButton
                    onClick={() => setOpenVariableForm(true)}
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
        </StyledTable>
        <Divider />
        {data.length > 10 && (
          <TablePagination
            component="div"
            count={data.length}
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
          // handleSubmitVariableFormData={() => console.log('')}
          handleClose={() => setOpenVariableForm(false)}
        />
      )}
    </StyledPaper>
  );
};

export default TableList;
