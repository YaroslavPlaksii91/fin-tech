import { useState, useMemo, useEffect } from 'react';
import { map } from 'lodash';
import { TableHead, TableBody, Table } from '@mui/material';
import dayjs from 'dayjs';

import {
  getProductionUserDefinedUsage,
  getUserDefinedUsage,
  getUserDefinedUsageStepIds
} from '../utils';
import { TAB, TableHeader } from '../types';

import { TableRow } from './TableRow';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  Variable,
  VariableUsageParams,
  VARIABLE_DATA_TYPE,
  UserDefinedVariable
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import TablePagination from '@components/shared/Table/TablePagination';
import useTablePagination from '@hooks/useTablePagination';
import { checkIsProductionFlow } from '@utils/helpers';
import { DATE_FORMAT } from '@constants/common';
import Paper from '@components/shared/Paper';

interface TableListProps {
  flowNodes: FlowNode[];
  tabName: TAB;
  headers: TableHeader[];
  tableData: Variable[];
  flowId: string;
  onEdit: (row: UserDefinedVariable, variableUsageStepIds: string[]) => void;
  onDelete: (row: UserDefinedVariable, variableUsageStepIds: string[]) => void;
}

const TableList = ({
  flowNodes,
  tabName,
  headers,
  tableData,
  flowId,
  onEdit,
  onDelete
}: TableListProps) => {
  const isProductionFlow = checkIsProductionFlow();

  const [userDefinedUsage, setUserDefinedUsage] =
    useState<VariableUsageParams>();

  const {
    rowsPerPage,
    page,
    totalPages,
    setPage,
    handlePageChange,
    handleRowsPerPageChange
  } = useTablePagination({ totalCount: tableData.length });

  const visibleRows = useMemo(
    () => tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, tableData]
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;

  useEffect(() => {
    if (tabName !== 'userDefined') return;

    const variables = map(tableData, 'name');

    isProductionFlow
      ? void getProductionUserDefinedUsage(variables).then((data) =>
          setUserDefinedUsage(data)
        )
      : void getUserDefinedUsage(flowId, variables).then((data) =>
          setUserDefinedUsage(data)
        );
  }, [tabName, flowId]);

  return (
    <Paper>
      <Table stickyHeader size="small" aria-label="sticky table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell />
            {headers.map(({ key, label, maxWidth }) => (
              <StyledTableCell key={key} sx={{ maxWidth }}>
                {label}
              </StyledTableCell>
            ))}
            {tabName === 'userDefined' && <StyledTableCell align="right" />}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((variable, index) => (
            <TableRow
              key={index}
              headers={headers}
              row={
                variable.dataType === VARIABLE_DATA_TYPE.DateTime
                  ? {
                      ...variable,
                      defaultValue: dayjs(variable.defaultValue).format(
                        DATE_FORMAT
                      )
                    }
                  : variable
              }
              index={index}
              tabName={tabName}
              flowId={flowId}
              flowNodes={flowNodes}
              userDefinedUsageStepIds={
                userDefinedUsage &&
                getUserDefinedUsageStepIds({ userDefinedUsage, variable })
              }
              onEdit={onEdit}
              onDelete={onDelete}
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
        <TablePagination
          count={tableData.length}
          totalPages={totalPages}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onPageApply={setPage}
        />
      )}
    </Paper>
  );
};

export default TableList;
