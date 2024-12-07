import { useState, useMemo, useEffect } from 'react';
import * as _ from 'lodash-es';
import { TableHead, TableBody, Table as MuiTable } from '@mui/material';

import {
  getProductionUserDefinedUsage,
  getUserDefinedUsage,
  getUserDefinedUsageStepIds
} from '../utils';
import { TAB, TableHeader } from '../types';

import { getFormattedVariable } from './utils';
import TableRow from './TableRow';

import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  DataDictionaryVariable,
  VariableUsageParams
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import TablePagination from '@components/shared/Table/TablePagination';
import useTablePagination from '@hooks/useTablePagination';
import { checkIsProductionFlow } from '@utils/helpers';
import Paper from '@components/shared/Paper';

interface TableProps {
  flowNodes: FlowNode[];
  tabName: TAB;
  headers: TableHeader[];
  tableData: DataDictionaryVariable[];
  flowId: string;
  onEdit: (row: DataDictionaryVariable, variableUsageStepIds: string[]) => void;
  onDelete: (
    row: DataDictionaryVariable,
    variableUsageStepIds: string[]
  ) => void;
}

const Table = ({
  flowNodes,
  tabName,
  headers,
  tableData,
  flowId,
  onEdit,
  onDelete
}: TableProps) => {
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

    const variables = _.map(tableData, 'name');

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
      <MuiTable stickyHeader size="small" aria-label="sticky table">
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
              row={getFormattedVariable(variable)}
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
      </MuiTable>
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

export default Table;
