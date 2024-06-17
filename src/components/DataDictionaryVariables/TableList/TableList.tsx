import { useState, useMemo, useEffect } from 'react';
import { indexOf, map } from 'lodash';
import {
  TableHead,
  TableBody,
  IconButton,
  TablePagination,
  TextField,
  Table,
  Box,
  Typography
} from '@mui/material';
import { AddBoxOutlined } from '@mui/icons-material';

import { VARIABLES_TABS } from '../constants';
import { getUserDefinedUsage, getUserDefinedUsageNodes } from '../utils';
import { VariableForm } from '../VariableForm/VariableForm';
import { DeleteVariable } from '../DeleteVariable/DeleteVariable';
import { TableHeader } from '../DataDictionaryVariables';

import { TableRow } from './TableRow';

import {
  StyledTableCell,
  StyledTableRow,
  StyledPaper
} from '@components/shared/Table/styled';
import {
  Variable,
  VariableUsageParams,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import { theme } from '@theme';
import { useAppSelector } from '@store/hooks';
import { selectFlow } from '@store/flow/selectors';
import { permissionsMap } from '@constants/permissions';
import { useHasUserPermission } from '@hooks/useHasUserPermission';

interface TableListProps {
  flowNodes: FlowNode[];
  tabName: VARIABLES_TABS;
  headers: TableHeader[];
  tableData: Variable[];
  flowId: string;
}

const TableList = ({
  flowNodes,
  tabName,
  headers,
  tableData,
  flowId
}: TableListProps) => {
  const [selectedVariable, setSelectedVariable] = useState<
    Variable & { index: number; variableIsUsed: boolean }
  >();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const canUserUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);

  const {
    flow: { temporaryVariables, permanentVariables }
  } = useAppSelector(selectFlow);

  const totalPages = Math.ceil(tableData.length / rowsPerPage);

  const [userDefinedUsage, setUserDefinedUsage] =
    useState<VariableUsageParams>();

  const visibleRows = useMemo(
    () => tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, tableData]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  const handleVariableModalClose = () => {
    setSelectedVariable(undefined);
    setIsVariableModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setSelectedVariable(undefined);
    setIsDeleteModalOpen(false);
  };

  const handleVariable = (row: Variable, variableUsageNodes: FlowNode[]) => {
    let variables;

    switch (row.sourceType) {
      case VARIABLE_SOURCE_TYPE.PermanentVariable: {
        variables = permanentVariables;
        break;
      }
      case VARIABLE_SOURCE_TYPE.TemporaryVariable: {
        variables = temporaryVariables;
        break;
      }
    }

    const indexOfVariable = indexOf(map(variables, 'name'), row.name);

    setSelectedVariable({
      index: indexOfVariable,
      variableIsUsed: !!variableUsageNodes.length,
      ...row
    });
  };

  const handleEditClick = (row: Variable, variableUsageNodes: FlowNode[]) => {
    handleVariable(row, variableUsageNodes);
    setIsVariableModalOpen(true);
  };

  const handleDeleteClick = (row: Variable, variableUsageNodes: FlowNode[]) => {
    handleVariable(row, variableUsageNodes);
    setIsDeleteModalOpen(true);
  };

  const handlePageBySelect = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    event && setPage(newPage);
  };

  const handlePageByInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newPage = Number(event.target.value) - 1;
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (tabName === VARIABLES_TABS.userDefined) {
      void getUserDefinedUsage(flowId, tableData).then((data) =>
        setUserDefinedUsage(data as VariableUsageParams)
      );
    }
  }, []);

  return (
    <StyledPaper>
      <Table stickyHeader size="small" aria-label="sticky table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell></StyledTableCell>
            {headers.map(({ key, label }) => (
              <StyledTableCell key={key}>{label}</StyledTableCell>
            ))}
            {tabName === VARIABLES_TABS.userDefined && (
              <StyledTableCell align="right">
                {canUserUpdateFlow && (
                  <IconButton
                    onClick={() => {
                      setSelectedVariable(undefined);
                      setIsVariableModalOpen(true);
                    }}
                    edge="end"
                    aria-label="add"
                    sx={{ p: 0, mr: 0 }}
                  >
                    <AddBoxOutlined fontSize="small" />
                  </IconButton>
                )}
              </StyledTableCell>
            )}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((variable, index) => (
            <TableRow
              key={index}
              headers={headers}
              row={variable}
              index={index}
              tabName={tabName}
              flowId={flowId}
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
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
          {emptyRows > 0 && (
            <StyledTableRow style={{ height: 43 * emptyRows }}>
              <StyledTableCell colSpan={6} />
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      {tableData.length > 10 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            p: '8px 16px'
          }}
        >
          <TablePagination
            sx={{ flex: 1 }}
            showFirstButton
            showLastButton
            component="div"
            count={tableData.length}
            page={page}
            onPageChange={handlePageBySelect}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <TextField
            sx={{ borderRadius: '8px', maxWidth: '64px', mr: 1 }}
            size="small"
            value={page + 1}
            onChange={handlePageByInput}
          />
          <Typography variant="body1" color={theme.palette.text.secondary}>
            of {totalPages} pages
          </Typography>
        </Box>
      )}
      {isVariableModalOpen && (
        <VariableForm
          flowId={flowId}
          formData={selectedVariable}
          isOpen={isVariableModalOpen}
          onClose={handleVariableModalClose}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteVariable
          flowId={flowId}
          variable={selectedVariable!}
          isOpen={isDeleteModalOpen}
          onClose={handleDeleteModalClose}
        />
      )}
    </StyledPaper>
  );
};

export default TableList;
