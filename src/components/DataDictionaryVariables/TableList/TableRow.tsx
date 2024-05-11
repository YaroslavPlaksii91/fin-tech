import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { indexOf, map } from 'lodash';
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
import { TableHeader } from '../DataDictionaryVariables';

import { StyledStack } from './styled';

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
import { Variable } from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import { dataDictionaryService } from '@services/data-dictionary';
import { DataDictionaryPageContext } from '@pages/DataDictionary';
import Logger from '@utils/logger';
import routes from '@constants/routes';
import { StepType } from '@components/FlowManagment/FlowChart/types';
import { theme } from '@theme';

type TableRowProps = {
  headers: TableHeader[];
  row: Variable;
  index: number;
  tabName: VARIABLES_TABS;
  flowId: string;
  flowNodes: FlowNode[];
  setSelectedVariable: (
    selectedVariable: Variable & { index: number; variableIsUsed: boolean }
  ) => void;
  userDefinedUsageNodes: FlowNode[] | undefined;
  setOpenVariableForm: (openVariableForm: boolean) => void;
  setDeleteVariable: (variable: {
    name: string;
    variableIsUsed: boolean;
  }) => void;
};

export const TableRow = ({
  headers,
  row,
  index,
  tabName,
  flowId,
  flowNodes,
  userDefinedUsageNodes,
  setSelectedVariable,
  setOpenVariableForm,
  setDeleteVariable
}: TableRowProps) => {
  const [isExpanded, setisExpanded] = useState(false);
  const [variableUsageNodes, setVariableUsageNodes] = useState<FlowNode[]>([]);

  const navigate = useNavigate();
  const value = useContext(DataDictionaryPageContext);

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
        {headers.map(({ key }) => (
          <StyledTableCell key={key}>{row[key]}</StyledTableCell>
        ))}
        {tabName === VARIABLES_TABS.userDefined && (
          <StyledTableCell>
            <Stack spacing={1} direction="row">
              <Button
                sx={{
                  minWidth: 'auto',
                  width: 'auto',
                  p: 0
                }}
                onClick={() => {
                  const indexOfVariable = indexOf(
                    map(value?.temporaryVariables, 'name'),
                    row.name
                  );

                  setSelectedVariable({
                    index: indexOfVariable,
                    variableIsUsed: !!variableUsageNodes.length,
                    ...row
                  });
                  setOpenVariableForm(true);
                }}
              >
                <Edit />
              </Button>
              <Button
                sx={{
                  minWidth: 'auto',
                  width: 'auto',
                  p: 0
                }}
                onClick={() =>
                  setDeleteVariable({
                    name: row.name,
                    variableIsUsed: !!variableUsageNodes.length
                  })
                }
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
          // TODO: if don`t have collapsing then should be controlled
          colSpan={headers.length + 1}
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
