import { useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Typography, Stack, TableHead, TableBody } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { keyBy } from 'lodash';

import { palette } from '../../themeConfig';

import {
  CATEGORIES,
  OPERATORS,
  CATEGORIES_WITHOUT_ELSE_ACTIONS,
  USAGE_MODE
} from './constants';
import { VariableRowData, VariableColumnData } from './types';
import {
  StyledPaper,
  StyledTableContainer,
  StyledStack,
  StyledTable
} from './styled';
import TableSkeleton from './TableSkeleton/TableSkeleton';
import StepNoteSection from './StepNoteSection/StepNoteSection';

import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { AddIcon } from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { SnackbarMessage } from '@components/shared/Snackbar/SnackbarMessage';
import useDataDictionaryVariables from '@hooks/useDataDictionaryVariables';
import { MAIN_STEP_ID, SNACK_TYPE } from '@constants/common';
import {
  DataDictionaryVariable,
  DATA_TYPE_WITH_ENUM_PREFIX
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';

type DecisionTableStepProps = {
  step: FlowNode;
  setStep: (step: FlowNode | { id: typeof MAIN_STEP_ID }) => void;
  rfInstance: CustomReactFlowInstance;
};

const DecisionTableStep = ({
  step,
  setStep,
  rfInstance: { getNodes, setNodes }
}: DecisionTableStepProps) => {
  const [noteValue, setNoteValue] = useState('');
  const [columnClickedIndex, setColumnClickedIndex] = useState(0);

  const [caseEntries, setCaseEntries] = useState([
    {
      conditions: [
        {
          variableName: 'AvgNetMonthlyIncome',
          operator: '>=',
          expression: '1000'
        },
        {
          variableName: 'EmailExtension',
          operator: 'Any',
          expression: ''
        }
      ],
      actions: [
        {
          variableName: 'MaxLoanAmount',
          operator: '=',
          expression: ' 1000'
        }
      ]
    },
    {
      conditions: [
        {
          variableName: 'AvgNetMonthlyIncome',
          operator: 'between',
          expression: '500,900'
        },
        {
          variableName: 'EmailExtension',
          operator: '!=',
          expression: 'co'
        }
      ],
      actions: [
        {
          variableName: 'MaxLoanAmount',
          operator: '>=',
          expression: ' 500'
        }
      ]
    }
  ]);

  const { variables } = useDataDictionaryVariables();

  const nodes: FlowNode[] = getNodes();

  const variablesDataTypes: Record<string, string> = variables.reduce(
    (acc, current) => ({
      ...acc,
      [current.variableName]: current.dataType
    }),
    {}
  );

  const conditionsColumns = caseEntries[0].conditions.map((el) =>
    Object.values(DATA_TYPE_WITH_ENUM_PREFIX).includes(
      variablesDataTypes[el.variableName] as DATA_TYPE_WITH_ENUM_PREFIX
    )
      ? {
          variableName: el.variableName,
          dataType: variablesDataTypes[el.variableName],
          // if variable enum type we have additional prop with allowedValues
          allowedValues: variables.find(
            (variable) => variable.variableName === el.variableName
          )?.allowedValues
        }
      : {
          variableName: el.variableName,
          dataType: variablesDataTypes[el.variableName]
        }
  );

  const conditionRows = caseEntries.map((row) => {
    return keyBy(row.conditions, 'variableName');
  });

  //console.log('step.data', step.data);

  useEffect(() => {
    const { data } = step;
    setNoteValue(data?.note ?? '');
  }, []);

  const onApplyChangesClick = () => {
    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        node.data = {
          ...node.data,
          note: noteValue,
          caseEntries: caseEntries,
          /*elseActions: [], */
          variableSources: []
        };
      }
      return node;
    });

    setNodes(updatedNodes);

    enqueueSnackbar(
      <SnackbarMessage
        message="Success"
        details={`Changes for the "${step.data.name}" step were successfully applied.`}
      />,
      { variant: SNACK_TYPE.SUCCESS }
    );
    // setStep({ id: MAIN_STEP_ID });
  };

  const handleAddNewLayer = () => {
    const newLayerColumns = conditionsColumns.map((column) => ({
      variableName: column.variableName,
      operator: '',
      expression: ''
    }));
    setCaseEntries((prev) => [
      ...prev,
      {
        conditions: newLayerColumns,
        actions: []
      }
    ]);
  };

  const handleDeleteLayer = (index: number) => {
    const newCaseEntries = [...caseEntries];
    newCaseEntries.splice(index, 1);
    setCaseEntries(newCaseEntries);
  };

  const handleChangeColumnClickedIndex = (
    newColumnIndex: number,
    category: CATEGORIES
  ) => {
    setColumnClickedIndex(newColumnIndex);
  };

  const handleInsertingColumn = ({
    columnClickedIndex
  }: {
    columnClickedIndex: number;
  }) => {
    setCaseEntries((prev) => {
      return prev.map((row) => {
        const newConditions = [...row.conditions];
        newConditions.splice(columnClickedIndex + 1, 0, {
          variableName: '',
          operator: '',
          expression: ''
        });

        return {
          ...row,
          conditions: newConditions
        };
      });
    });
  };

  const handleDeleteCategoryColumn = ({
    columnVariableName
  }: {
    columnVariableName: string;
  }) => {
    setCaseEntries((prev) => {
      return prev.map((row) => {
        const newConditions = [...row.conditions];
        return {
          ...row,
          conditions: newConditions.filter(
            (el) => el.variableName !== columnVariableName
          )
        };
      });
    });
  };

  const handleChangeColumnVariable = ({
    columnIndex,
    newVariable
  }: {
    columnIndex: number;
    newVariable: Pick<DataDictionaryVariable, 'variableName'>;
  }) => {
    setCaseEntries((prev) => {
      return prev.map((row) => {
        const newConditions = [...row.conditions];
        newConditions.splice(columnIndex, 1, {
          variableName: newVariable.variableName,
          operator: '',
          expression: ''
        });

        return {
          ...row,
          conditions: newConditions
        };
      });
    });
  };

  const handleSubmitVariableValue = ({
    formFieldData
  }: {
    formFieldData: any;
  }) => {
    const { rowIndex, variableName, operator } = formFieldData;
    setCaseEntries((prev) => {
      return prev.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            conditions: row.conditions.map((column) =>
              column.variableName !== variableName
                ? column
                : {
                    ...column,
                    operator: operator,
                    expression: formFieldData.value
                  }
            )
          };
        } else {
          return row;
        }
      });
    });
  };

  const handleSubmitVariableValueForEnum = ({
    rowIndex,
    variableName,
    newEnumValue
  }: {
    rowIndex: number;
    variableName: string;
    newEnumValue: string;
  }) => {
    setCaseEntries((prev) => {
      return prev.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            conditions: row.conditions.map((column) =>
              column.variableName !== variableName
                ? column
                : {
                    ...column,
                    operator: '=',
                    expression: newEnumValue
                  }
            )
          };
        } else {
          return row;
        }
      });
    });
  };

  // console.log({ caseEntries });

  return (
    <>
      <StepDetailsHeader
        title={step.data.name}
        details="A decision table is a step that allows to set expressions for
        columns and rows. The system will go through the table and analyze the
        values."
        onDiscard={() => {}}
        disabled={false}
        isSubmitting={false}
        buttonType="button"
        onApplyChangesClick={onApplyChangesClick}
      />
      <StyledPaper>
        <StyledTableContainer>
          <Stack sx={{ width: 'inherit' }}>
            <StyledStack
              sx={{
                borderRight: '1px solid rgba(209, 217, 226, 0.4)',
                borderBottom: '2px solid rgba(209, 217, 226, 0.4)'
              }}
            >
              Condition
            </StyledStack>
            <TableSkeleton
              columns={conditionsColumns}
              rows={conditionRows}
              variablesOptions={variables.filter(
                (variable) => variable.usageMode !== USAGE_MODE.WriteOnly
              )}
              columnClickedIndex={columnClickedIndex}
              category={CATEGORIES.Conditions}
              handleDeleteRow={handleDeleteLayer}
              handleChangeColumnClickedIndex={handleChangeColumnClickedIndex}
              handleInsertingColumn={handleInsertingColumn}
              handleDeleteCategoryColumn={handleDeleteCategoryColumn}
              handleChangeColumnVariable={handleChangeColumnVariable}
              handleSubmitVariableValue={handleSubmitVariableValue}
              handleSubmitVariableValueForEnum={
                handleSubmitVariableValueForEnum
              }
            />
          </Stack>
          {/* <Stack>
            <StyledStack
              sx={{ borderBottom: '2px solid rgba(209, 217, 226, 0.4)' }}
            >
              Output
            </StyledStack>
            <TableSkeleton
              columns={actions.columns}
              rows={actions.rows}
              variablesOptions={variables.filter(
                (variable) => variable.usageMode !== USAGE_MODE.ReadOnly
              )}
              columnClickedId={actions.columnClickedId}
              category={CATEGORIES.Actions}
              handleDeleteRow={handleDeleteLayer}
              handleChangeColumnClickedId={handleChangeColumnClickedId}
              handleInsertingColumn={handleInsertingColumn}
              handleDeleteColumn={handleDeleteColumn}
              handleChangeColumnVariable={handleChangeColumnVariable}
              handleSubmitVariableValue={handleSubmitVariableValue}
            />
          </Stack> */}
        </StyledTableContainer>
      </StyledPaper>
      <Button
        sx={{ width: '135px', margin: '16px' }}
        onClick={() => handleAddNewLayer()}
        startIcon={<AddIcon />}
      >
        <Typography variant="body2" color={palette.gray}>
          Add new layer
        </Typography>
      </Button>
      <StepDetailsHeader
        title="Otherwise condition"
        details="A condition used when no rule from previous table was not executed."
        isActionContainerVisible={false}
        onDiscard={() => {}}
        disabled={false}
        isSubmitting={false}
      />
      {/* Otherwise table */}
      {/* <StyledPaper>
        <StyledTableContainer
          sx={{
            '& .MuiTableCell-root': {
              height: '46px'
            }
          }}
        >
          <StyledTable>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell> Otherwise Condition</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell> Else</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </StyledTable>
          <TableSkeleton
            columns={actions.columns}
            rows={elseActions.rows}
            variablesOptions={variables.filter(
              (variable) => variable.usageMode !== USAGE_MODE.ReadOnly
            )}
            category={CATEGORIES.ElseActions}
            handleSubmitVariableValue={handleSubmitVariableValue}
          />
        </StyledTableContainer>
      </StyledPaper> */}

      <StepNoteSection noteValue={noteValue} setNoteValue={setNoteValue} />
    </>
  );
};

export default DecisionTableStep;
