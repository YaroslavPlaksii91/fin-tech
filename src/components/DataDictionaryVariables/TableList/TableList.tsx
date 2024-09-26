import {
  useState,
  useMemo,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import { indexOf, map } from 'lodash';
import { TableHead, TableBody, Table } from '@mui/material';
import dayjs from 'dayjs';

import { TableHeader } from '../constants';
import {
  getProductionUserDefinedUsage,
  getUserDefinedUsage,
  getUserDefinedUsageStepIds
} from '../utils';
import { VariableForm } from '../VariableForm/VariableForm';
import { DeleteVariable } from '../DeleteVariable/DeleteVariable';
import { TAB } from '../types';

import { TableRow } from './TableRow';

import {
  StyledTableCell,
  StyledTableRow,
  StyledPaper
} from '@components/shared/Table/styled';
import {
  Variable,
  VariableUsageParams,
  VARIABLE_SOURCE_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  UserDefinedVariable
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import { useAppSelector } from '@store/hooks';
import { selectFlow } from '@store/flow/selectors';
import TablePagination from '@components/shared/TablePagination';
import useTablePagination from '@hooks/useTablePagination';
import { checkIsProductionFlow } from '@utils/helpers';
import { DATE_FORMAT } from '@constants/common';

interface TableListProps {
  flowNodes: FlowNode[];
  tabName: TAB;
  headers: TableHeader[];
  tableData: Variable[];
  flowId: string;
}

const TableList = forwardRef(
  ({ flowNodes, tabName, headers, tableData, flowId }: TableListProps, ref) => {
    const [selectedVariable, setSelectedVariable] = useState<
      UserDefinedVariable & {
        index: number;
        variableIsUsed: boolean;
      }
    >();

    const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const isProductionFlow = checkIsProductionFlow();

    const [userDefinedUsage, setUserDefinedUsage] =
      useState<VariableUsageParams>();

    const {
      flow: { temporaryVariables, permanentVariables }
    } = useAppSelector(selectFlow);

    const {
      rowsPerPage,
      page,
      totalPages,
      handlePageChange,
      handlePageApply,
      handleRowsPerPageChange
    } = useTablePagination({ totalCount: tableData.length });

    const visibleRows = useMemo(
      () =>
        tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
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

    const handleVariable = (
      row: UserDefinedVariable,
      variableUsageStepIds: string[]
    ) => {
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
        variableIsUsed: !!variableUsageStepIds.length,
        ...row
      });
    };

    const handleEditClick = (
      row: UserDefinedVariable,
      variableUsageStepIds: string[]
    ) => {
      handleVariable(row, variableUsageStepIds);
      setIsVariableModalOpen(true);
    };

    const handleDeleteClick = (
      row: UserDefinedVariable,
      variableUsageStepIds: string[]
    ) => {
      handleVariable(row, variableUsageStepIds);
      setIsDeleteModalOpen(true);
    };

    useImperativeHandle(ref, () => ({
      openVariableModal: () => {
        setSelectedVariable(undefined);
        setIsVariableModalOpen(true);
      }
    }));

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
    }, [tabName]);

    return (
      <StyledPaper sx={{ overflow: 'auto' }}>
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell />
              {headers.map(({ key, label }) => (
                <StyledTableCell key={key}>{label}</StyledTableCell>
              ))}
              {tabName === 'userDefined' && <StyledTableCell />}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((variable, index) => (
              <TableRow
                key={index}
                headers={headers}
                row={
                  variable.dataType === DATA_TYPE_WITHOUT_ENUM.DateTime
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
          <TablePagination
            count={tableData.length}
            totalPages={totalPages}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPageApply={handlePageApply}
          />
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
  }
);

TableList.displayName = 'TableList';

export default TableList;
