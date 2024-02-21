import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Typography, Stack, TableHead, TableBody } from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import { palette } from '../../themeConfig';

import {
  CATEGORIES,
  OPERATORS,
  CATEGORIES_WITHOUT_ELSE_ACTIONS,
  USAGE_MODE
} from './constants';
import {
  VariableRowData,
  SelectedCategoriesEntries,
  VariableHeaderData
} from './types';
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
import { DataDictionaryVariable } from '@domain/dataDictionary';
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
  const firstConditionsColumnId = uuidv4();
  const firstActionsColumnId = uuidv4();

  const [selectedCategoriesEntries, setSelectedCategoriesEntries] =
    useState<SelectedCategoriesEntries>({
      conditions: {
        columnClickedId: firstConditionsColumnId,
        columns: [
          {
            id: firstConditionsColumnId,
            variableName: '',
            dataType: '',
            allowedValues: ''
          }
        ],
        rows: []
      },
      actions: {
        columnClickedId: firstActionsColumnId,
        columns: [
          {
            id: firstActionsColumnId,
            variableName: '',
            dataType: '',
            allowedValues: ''
          }
        ],
        rows: []
      },
      elseActions: {
        rows: [
          {
            id: uuidv4(),
            variableName: '',
            variableType: '',
            operator: ''
          }
        ]
      }
    });

  const [noteValue, setNoteValue] = useState('');

  const { variables } = useDataDictionaryVariables();

  const nodes: FlowNode[] = getNodes();

  useEffect(() => {
    const { data } = step;
    setNoteValue(data?.note ?? '');
  }, []);

  const onApplyChangesClick = () => {
    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        node.data = {
          ...node.data,
          note: noteValue
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
    setStep({ id: MAIN_STEP_ID });
  };

  const handleAddNewLayer = () => {
    const newRowId = uuidv4();

    setSelectedCategoriesEntries({
      ...selectedCategoriesEntries,
      conditions: {
        ...selectedCategoriesEntries.conditions,
        rows: [
          ...selectedCategoriesEntries.conditions.rows,
          {
            id: newRowId,
            variableName: '',
            variableType: '',
            operator: ''
          }
        ]
      },
      actions: {
        ...selectedCategoriesEntries.actions,
        rows: [
          ...selectedCategoriesEntries.actions.rows,
          {
            id: newRowId,
            variableName: '',
            variableType: '',
            operator: ''
          }
        ]
      }
    });
  };

  const handleDeleteLayer = (id: string) => {
    const { conditions, actions } = selectedCategoriesEntries;

    const newConditionsRows = conditions.rows.filter((item) => item.id !== id);
    const newActionsRows = actions.rows.filter((item) => item.id !== id);

    setSelectedCategoriesEntries({
      ...selectedCategoriesEntries,
      conditions: {
        ...selectedCategoriesEntries.conditions,
        rows: newConditionsRows
      },
      actions: {
        ...selectedCategoriesEntries.actions,
        rows: newActionsRows
      }
    });
  };

  const handleChangeColumnClickedId = (
    newColumnId: string,
    category: CATEGORIES
  ) => {
    setSelectedCategoriesEntries({
      ...selectedCategoriesEntries,
      [category]: {
        ...selectedCategoriesEntries[category],
        columnClickedId: newColumnId
      }
    });
  };

  const handleInsertingColumn = ({
    columnClickedIndex,
    category
  }: {
    columnClickedIndex: number;
    category: CATEGORIES;
  }) => {
    const newColumns = [
      ...selectedCategoriesEntries[category as CATEGORIES_WITHOUT_ELSE_ACTIONS]
        .columns
    ];

    newColumns.splice(columnClickedIndex + 1, 0, {
      id: uuidv4(),
      variableName: '',
      dataType: '',
      allowedValues: ''
    });

    setSelectedCategoriesEntries({
      ...selectedCategoriesEntries,
      [category]: {
        ...selectedCategoriesEntries[category],
        columns: newColumns
      }
    });
  };

  const handleDeleteCategoryColumn = ({
    columnId,
    category
  }: {
    columnId: string;
    category: CATEGORIES;
  }) => {
    const newColumns = [
      ...selectedCategoriesEntries[category as CATEGORIES_WITHOUT_ELSE_ACTIONS]
        .columns
    ].filter((item) => item.id !== columnId);

    setSelectedCategoriesEntries({
      ...selectedCategoriesEntries,
      [category]: {
        ...selectedCategoriesEntries[category],
        columns: newColumns
      }
    });
  };

  const handleChangeColumnVariable = ({
    columnId,
    newVariable,
    category
  }: {
    columnId: string;
    newVariable: Omit<
      DataDictionaryVariable,
      'defaultValue' | 'isRequired' | 'usageMode' | 'description'
    >;
    category: CATEGORIES;
  }) => {
    const updatedColumns = selectedCategoriesEntries[
      category as CATEGORIES_WITHOUT_ELSE_ACTIONS
    ].columns.map((item: VariableHeaderData) => {
      if (item.id === columnId) {
        return {
          ...item,
          variableName: newVariable.variableName,
          dataType: newVariable.dataType,
          allowedValues: newVariable.allowedValues
        };
      } else {
        return item;
      }
    });

    setSelectedCategoriesEntries({
      ...selectedCategoriesEntries,
      [category]: {
        ...selectedCategoriesEntries[category],
        columns: updatedColumns
      }
    });
  };

  const handleSubmitVariableValue = ({
    newVariableValue,
    category
  }: {
    newVariableValue: VariableRowData;
    category: CATEGORIES;
  }) => {
    const { id, variableName, operator } = newVariableValue;

    const updatedRows = selectedCategoriesEntries[category].rows.map(
      (row: VariableRowData) => {
        if (row.id === id) {
          return {
            ...row,
            [variableName as keyof VariableRowData]:
              operator === OPERATORS.Between
                ? `${operator} ${newVariableValue.lowerBound} and ${newVariableValue.upperBound}`
                : `${operator} ${newVariableValue.value}`
          };
        } else {
          return row;
        }
      }
    );

    setSelectedCategoriesEntries({
      ...selectedCategoriesEntries,
      [category]: {
        ...selectedCategoriesEntries[category],
        rows: updatedRows
      }
    });
  };

  const { conditions, actions, elseActions } = selectedCategoriesEntries;
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
              columns={conditions.columns}
              rows={conditions.rows}
              variablesOptions={variables.filter(
                (variable) => variable.usageMode !== USAGE_MODE.WriteOnly
              )}
              columnClickedId={conditions.columnClickedId}
              category={CATEGORIES.Conditions}
              handleDeleteRow={handleDeleteLayer}
              handleChangeColumnClickedId={handleChangeColumnClickedId}
              handleInsertingColumn={handleInsertingColumn}
              handleDeleteCategoryColumn={handleDeleteCategoryColumn}
              handleChangeColumnVariable={handleChangeColumnVariable}
              handleSubmitVariableValue={handleSubmitVariableValue}
            />
          </Stack>
          <Stack>
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
              handleDeleteCategoryColumn={handleDeleteCategoryColumn}
              handleChangeColumnVariable={handleChangeColumnVariable}
              handleSubmitVariableValue={handleSubmitVariableValue}
            />
          </Stack>
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
      <StyledPaper>
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
      </StyledPaper>

      <StepNoteSection noteValue={noteValue} setNoteValue={setNoteValue} />
    </>
  );
};

export default DecisionTableStep;
