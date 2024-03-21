import { useState } from 'react';
import { indexOf, map } from 'lodash';
import { useParams } from 'react-router-dom';
import { IconButton, Stack, Button, Collapse, Box } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import { VARIABLES_TABS } from '../constants';

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
import { flowService } from '@services/flow-service';
// import { dataDictionaryService } from '@services/data-dictionary';
import Logger from '@utils/logger';

type TableRowProps = {
  row:
    | DataDictionaryVariable
    | Pick<
        UserDefinedVariable,
        'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
      >;
  key: number;
  tabName: VARIABLES_TABS;
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
  key,
  tabName,
  setSelectedVariable,
  tableList,
  setTableList,
  setOpenVariableForm
}: TableRowProps) => {
  const [isExpanded, setisExpanded] = useState(false);

  const { id } = useParams();

  // const getVariableUsage = async (variableName: string) => {
  //   const resultData =
  //     id && (await dataDictionaryService.getVariableUsage(id, variableName));

  //   // console.log('resultData', resultData);
  // };

  return (
    <>
      <StyledTableRow key={key} sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setisExpanded(!isExpanded)}
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
            <Box sx={{ margin: 1 }}></Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
};
