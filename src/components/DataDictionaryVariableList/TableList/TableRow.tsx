import { useState } from 'react';
import { indexOf, map } from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import { IconButton, Stack, Button, Collapse, Typography } from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  NavigateNext
} from '@mui/icons-material';

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
import { JSONPatchOperation } from '@domain/entity';
import { FlowNode } from '@domain/flow';
import { flowService } from '@services/flow-service';
import { dataDictionaryService } from '@services/data-dictionary';
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
  flowNodes: FlowNode[];
  setSelectedVariable: (
    selectedVariable: Pick<
      UserDefinedVariable,
      'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
    > & { index: number }
  ) => void;
  tableList:
    | DataDictionaryVariable[]
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >[];
  setTableList: (list: UserDefinedVariable[]) => void;
  setOpenVariableForm: (openVariableForm: boolean) => void;
};

export const TableRow = ({
  row,
  index,
  tabName,
  flowNodes,
  setSelectedVariable,
  tableList,
  setTableList,
  setOpenVariableForm
}: TableRowProps) => {
  const [isExpanded, setisExpanded] = useState(false);
  const [variableUsageNodes, setVariableUsageNodes] = useState<FlowNode[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getVariableUsage = async (variableName: string) => {
    const resultData: FlowNode[] = [];
    try {
      const responseData =
        id && (await dataDictionaryService.getVariableUsage(id, variableName));

      if (responseData && responseData?.length) {
        responseData.forEach((variable) => {
          const node = flowNodes.find((node) => node.id === variable.path[0]);
          node && resultData.push(node);
        });
      }

      //console.log('variableUsageNodes', resultData);
      setVariableUsageNodes(resultData);
    } catch (error) {
      Logger.error('Error fetching variable usage in the flow:', error);
    }
  };

  return (
    <>
      <StyledTableRow key={index} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setisExpanded(!isExpanded);
              !isExpanded && void getVariableUsage(row.name);
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
                    map(tableList, 'name'),
                    row.name
                  );

                  setSelectedVariable({
                    index: indexOfVariable,
                    ...row
                  });
                  setOpenVariableForm(true);
                }}
              >
                <EditNoteOutlinedIcon />
              </Button>
              <Button
                sx={{}}
                onClick={async () => {
                  const operations: JSONPatchOperation[] = [
                    {
                      path: `/temporaryVariables/${indexOf(
                        map(tableList, 'name'),
                        row.name
                      )}`,
                      op: 'remove'
                    }
                  ];

                  try {
                    const resultData =
                      id && (await flowService.updateFlow(id, operations));

                    resultData &&
                      setTableList([
                        ...(resultData?.temporaryVariables as UserDefinedVariable[]),
                        ...(resultData.permanentVariables as UserDefinedVariable[])
                      ]);
                  } catch (error) {
                    Logger.error(
                      'Error deleting temporary variables in the flow:',
                      error
                    );
                  }
                }}
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
                <Stack
                  key={flowNode.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <NavigateNext fontSize="medium" />
                  <StyledStack
                    aria-label="breadcrumb"
                    onClick={() =>
                      navigate(routes.underwriting.flow.edit(id as string), {
                        state: { node: flowNode }
                      })
                    }
                  >
                    {flowNode?.data?.name}
                  </StyledStack>
                </Stack>
              ))}
            </Stack>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
