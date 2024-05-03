import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Stack,
  Button,
  Collapse,
  Typography,
  Box
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { VARIABLES_TABS } from '../constants';

import { StyledStack } from './styled';
import { TableEl } from './TableList';

import {
  Edit,
  Trash,
  CalculatorIcon,
  DecisionTableIcon
} from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import { FlowNode } from '@domain/flow';
import { dataDictionaryService } from '@services/data-dictionary';
import Logger from '@utils/logger';
import routes from '@constants/routes';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { theme } from '@theme';

type TableRowProps = {
  row: TableEl;
  index: number;
  tabName: VARIABLES_TABS;
  flowId: string;
  flowNodes: FlowNode[];
  userDefinedUsageNodes: FlowNode[] | undefined;
  onDelete: (row: TableEl, variableUsageNodes: FlowNode[]) => void;
  onEdit: (row: TableEl, variableUsageNodes: FlowNode[]) => void;
};

export const TableRow = ({
  row,
  index,
  tabName,
  flowId,
  flowNodes,
  userDefinedUsageNodes,
  onDelete,
  onEdit
}: TableRowProps) => {
  const [isExpanded, setisExpanded] = useState(false);
  const [variableUsageNodes, setVariableUsageNodes] = useState<FlowNode[]>([]);

  const navigate = useNavigate();

  const rowParity = (index + 1) % 2 === 0 ? 'even' : 'odd';

  const getVariableUsage = async (variableName: string) => {
    const resultData: FlowNode[] = [];
    try {
      const responseData = await dataDictionaryService.getVariableUsage(
        flowId,
        variableName
      );

      if (responseData && responseData?.length) {
        responseData.forEach((variable) => {
          const node = flowNodes.find((node) => node.id === variable.path[0]);
          node && resultData.push(node);
        });
      }

      setVariableUsageNodes(resultData);
    } catch (error) {
      Logger.error('Error fetching variable usage in the flow:', error);
    }
  };

  useEffect(() => {
    if (userDefinedUsageNodes?.length) {
      setVariableUsageNodes(userDefinedUsageNodes);
    }
  }, [userDefinedUsageNodes]);

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
                tabName != VARIABLES_TABS.userDefined &&
                void getVariableUsage(row.name);
            }}
          >
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell>{row.name}</StyledTableCell>
        <StyledTableCell>{row.dataType}</StyledTableCell>
        <StyledTableCell>{row.defaultValue}</StyledTableCell>
        <StyledTableCell>{row.description}</StyledTableCell>
        {tabName === VARIABLES_TABS.userDefined && (
          <StyledTableCell>
            <Stack spacing={1} direction="row">
              <Button
                sx={{
                  minWidth: 'auto',
                  width: 'auto',
                  p: 0
                }}
                onClick={() => onEdit(row, variableUsageNodes)}
              >
                <Edit />
              </Button>
              <Button
                sx={{
                  minWidth: 'auto',
                  width: 'auto',
                  p: 0
                }}
                onClick={() => onDelete(row, variableUsageNodes)}
              >
                <Trash />
              </Button>
            </Stack>
          </StyledTableCell>
        )}
      </StyledTableRow>
      <StyledTableRow parity={rowParity}>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
          sx={{ ...(!isExpanded && { border: 'unset' }) }}
        >
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Stack margin={1} spacing={1}>
              <Typography variant="body1">This variable is used in:</Typography>
              {variableUsageNodes.map((flowNode) => (
                <StyledStack
                  key={flowNode.id}
                  aria-label="breadcrumb"
                  onClick={() =>
                    navigate(routes.underwriting.flow.edit(flowId), {
                      state: { activeStepId: flowNode.id }
                    })
                  }
                >
                  <Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {flowNode.type === StepType.CALCULATION ? (
                        <CalculatorIcon />
                      ) : (
                        <DecisionTableIcon />
                      )}
                      <Typography
                        sx={{ textDecoration: 'underline' }}
                        variant="body1"
                        color={theme.palette.info.main}
                      >
                        {flowNode.data.name}
                      </Typography>
                    </Box>
                  </Stack>
                </StyledStack>
              ))}
            </Stack>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
