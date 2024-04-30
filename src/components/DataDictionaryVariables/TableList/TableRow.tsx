import { useState, useEffect, useContext } from 'react';
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

import { StyledStack, StyledNavLink } from './styled';

import { Edit, Trash, Calculator } from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import {
  UserDefinedVariable,
  DataDictionaryVariable
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import { dataDictionaryService } from '@services/data-dictionary';
import { DataDictionaryPageContext } from '@pages/DataDictionary';
import Logger from '@utils/logger';
import routes from '@constants/routes';

type TableRowProps = {
  row:
    | DataDictionaryVariable
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >;
  index: number;
  tabName: VARIABLES_TABS;
  flowId: string;
  flowNodes: FlowNode[];
  setSelectedVariable: (
    selectedVariable: Pick<
      UserDefinedVariable,
      'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
    > & { index: number; variableIsUsed: boolean }
  ) => void;
  userDefinedUsageNodes: FlowNode[] | undefined;
  setOpenVariableForm: (openVariableForm: boolean) => void;
  setDeleteVariable: (variable: {
    name: string;
    variableIsUsed: boolean;
  }) => void;
};

export const TableRow = ({
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
          colSpan={6}
          sx={{ ...(!isExpanded && { border: 'unset' }) }}
        >
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Stack margin={1} spacing={1}>
              <Typography variant="body1">This variable is used in:</Typography>
              {variableUsageNodes.map((flowNode) => (
                <StyledStack key={flowNode.id} aria-label="breadcrumb">
                  <Stack>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Calculator />
                      <StyledNavLink to={routes.underwriting.flow.edit(flowId)}>
                        {flowNode.data.name}
                      </StyledNavLink>
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
