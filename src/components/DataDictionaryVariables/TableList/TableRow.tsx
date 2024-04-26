import { useState, useEffect, useContext } from 'react';
import { indexOf, map } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { IconButton, Stack, Button, Collapse, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { VARIABLES_TABS } from '../constants';

import { StyledStack } from './styled';

import {
  DeleteOutlineIcon,
  EditNoteOutlinedIcon
} from '@components/shared/Icons';
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
import routes from '@constants/routes';
import Logger from '@utils/logger';

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
  const navigate = useNavigate();

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
      <StyledTableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          <StyledTableCell align="right" sx={{ padding: 0 }} width={70}>
            <Stack direction="row" sx={{ maxWidth: '0px' }}>
              <Button
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
                <EditNoteOutlinedIcon />
              </Button>
              <Button
                onClick={() =>
                  setDeleteVariable({
                    name: row.name,
                    variableIsUsed: !!variableUsageNodes.length
                  })
                }
              >
                <DeleteOutlineIcon />
              </Button>
            </Stack>
          </StyledTableCell>
        )}
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
        >
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Stack margin={1} spacing={1}>
              <Typography variant="body1" fontWeight={600}>
                This variable is used in:
              </Typography>

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
                  {flowNode?.data?.name}
                </StyledStack>
              ))}
            </Stack>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
