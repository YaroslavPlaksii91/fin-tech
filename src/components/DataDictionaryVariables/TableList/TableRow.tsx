import { useState, useEffect, useCallback } from 'react';
import { IconButton, Stack, Button, Collapse, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { TableHeader, VARIABLES_TABS } from '../constants';

import StepBreadcrumbs from './StepBreadcrumbs';

import TrashIcon from '@icons/trash.svg';
import EditIcon from '@icons/editPencil.svg';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import { Variable } from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import { dataDictionaryService } from '@services/data-dictionary';
import Logger from '@utils/logger';
import { theme } from '@theme';
import { permissionsMap } from '@constants/permissions';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { checkIsProductionFlow } from '@utils/helpers';
import routes from '@constants/routes';
import { PRODUCTION_FLOW_ID } from '@constants/common';

type TableRowProps = {
  headers: TableHeader[];
  row: Variable;
  index: number;
  tabName: VARIABLES_TABS;
  flowId: string;
  flowNodes: FlowNode[];
  userDefinedUsageStepIds: string[] | undefined;
  onDelete: (row: Variable, variableUsageStepIds: string[]) => void;
  onEdit: (row: Variable, variableUsageStepIds: string[]) => void;
};

export const TableRow = ({
  headers,
  row,
  index,
  tabName,
  flowId,
  flowNodes,
  userDefinedUsageStepIds,
  onDelete,
  onEdit
}: TableRowProps) => {
  const [isExpanded, setisExpanded] = useState(false);
  const [stepIds, setStepIds] = useState<string[]>([]);

  const hasUserPermission = useHasUserPermission(permissionsMap.canUpdateFlow);
  const navigate = useNavigate();
  const isProductionFlow = checkIsProductionFlow();
  const isViewMode = isProductionFlow || !hasUserPermission;

  const rowParity = (index + 1) % 2 === 0 ? 'even' : 'odd';

  const getVariableUsage = async (variableName: string) => {
    const stepIds: string[] = [];

    try {
      const getVariable = isProductionFlow
        ? () => dataDictionaryService.getProductionVariableUsage(variableName)
        : () => dataDictionaryService.getVariableUsage(flowId, variableName);

      const responseData = await getVariable();

      if (responseData && responseData?.length) {
        responseData.forEach((variable) => {
          const lastStepId = variable.path[variable.path.length - 1];
          stepIds.push(lastStepId);
        });
      }

      setStepIds(stepIds);
    } catch (error) {
      Logger.error('Error fetching variable usage in the flow:', error);
    }
  };

  useEffect(() => {
    if (userDefinedUsageStepIds?.length) {
      setStepIds(userDefinedUsageStepIds);
    }
  }, [userDefinedUsageStepIds]);

  const handleBreadcrumbOnClick = useCallback(
    ({
      subFlowId,
      stepId
    }: {
      subFlowId: string | null;
      stepId: string | null;
    }) => {
      if (hasUserPermission && !isProductionFlow) {
        navigate(routes.underwriting.flow.edit(flowId), {
          state: { subFlowId, stepId }
        });
      } else {
        const id = isProductionFlow ? PRODUCTION_FLOW_ID : flowId;
        navigate(routes.underwriting.flow.view(id), {
          state: { subFlowId, stepId }
        });
      }
    },
    [hasUserPermission, isProductionFlow]
  );

  return (
    <>
      <StyledTableRow
        parity={rowParity}
        key={index}
        sx={{ ...(isExpanded && { '& > td': { border: 'unset' } }) }}
      >
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setisExpanded(!isExpanded);
              !isExpanded &&
                tabName !== VARIABLES_TABS.userDefined &&
                void getVariableUsage(row.name);
            }}
          >
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </StyledTableCell>
        {headers.map(({ key }) => (
          <StyledTableCell key={key}>{row[key]?.toString()}</StyledTableCell>
        ))}
        {tabName === VARIABLES_TABS.userDefined && (
          <StyledTableCell>
            {!isViewMode && (
              <Stack spacing={1} direction="row">
                <Button
                  sx={{
                    minWidth: 'auto',
                    width: 'auto',
                    p: 0
                  }}
                  onClick={() => onEdit(row, stepIds)}
                >
                  <EditIcon color={theme.palette.action.active} />
                </Button>
                <Button
                  sx={{
                    minWidth: 'auto',
                    width: 'auto',
                    p: 0
                  }}
                  onClick={() => onDelete(row, stepIds)}
                >
                  <TrashIcon color={theme.palette.error.main} />
                </Button>
              </Stack>
            )}
          </StyledTableCell>
        )}
      </StyledTableRow>
      <StyledTableRow parity={rowParity}>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          // TODO: if don`t have collapsing then should be controlled
          colSpan={headers.length + 1}
          sx={{ ...(!isExpanded && { border: 'unset' }) }}
        >
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Stack margin={1} spacing={1}>
              <Typography variant="body1">This variable is used in:</Typography>
              {stepIds.map((id, idx) => (
                <StepBreadcrumbs
                  key={idx}
                  stepId={id}
                  flowNodes={flowNodes}
                  handleClick={handleBreadcrumbOnClick}
                />
              ))}
            </Stack>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
