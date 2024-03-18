import { useState, useMemo } from 'react';
import {
  TableHead,
  TableBody,
  IconButton,
  TablePagination,
  Divider,
  Stack,
  Button
} from '@mui/material';
import AddBoxOutlined from '@mui/icons-material/AddBoxOutlined';

import { VARIABLES_TABS } from '../constants';
import { VariableForm } from '../VariableForm/VariableForm';

import { StyledPaper, StyledTableContainer, StyledTable } from './styled';

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openVariableForm, setOpenVariableForm] = useState(false);

  const visibleRows = useMemo(
    () => tableList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, tableList.length]
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
                <StyledTableCell sx={{ maxWidth: '150px' }}>
                  {variable.description}
                </StyledTableCell>
                {tabName === VARIABLES_TABS.userDefined && (
                  <StyledTableCell>
                    <Stack direction="row" sx={{ maxWidth: '0px' }}>
                      <Button sx={{}} onClick={() => {}}>
                        <EditNoteOutlinedIcon />
                      </Button>
                      <Button
                        sx={{}}
                        onClick={() => {
                          const newTableList = [...tableList];
                          newTableList.splice(index, 1);
                          setTableList(newTableList);
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
        </StyledTable>
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
          handleSubmitVariableFormData={(
            newVariable: Pick<
              UserDefinedVariable,
              | 'name'
              | 'dataType'
              | 'defaultValue'
              | 'description'
              | 'sourceType'
            >
          ) => {
            setTableList([...tableList, newVariable]);
            setOpenVariableForm(false);
          }}
          handleClose={() => setOpenVariableForm(false)}
        />
      )}
    </StyledPaper>
  );
};

export default TableList;
