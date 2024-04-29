import { useEffect, useState, useContext, useMemo } from 'react';
import { Button, Typography, Stack, TableHead, TableBody } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { keyBy } from 'lodash';

import { palette } from '../../themeConfig';

import { CATEGORIES, CATEGORIES_WITHOUT_ELSE_ACTIONS } from './constants';
import {
  VariableColumnData,
  SelectedCellInRowData,
  FormFieldsProps,
  CaseEntry
} from './types';
import {
  StyledPaper,
  StyledTableContainer,
  StyledStack,
  StyledTable
} from './styled';
import TableSkeleton from './TableSkeleton/TableSkeleton';
import StepNoteSection from './StepNoteSection/StepNoteSection';
import {
  getSerializedCaseEntries,
  getSerializedDefaultActions,
  setVariableSources
} from './utils';

import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { AddIcon } from '@components/shared/Icons';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { SnackbarMessage } from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import {
  DataDictionaryVariable,
  UserDefinedVariable,
  DATA_TYPE_WITH_ENUM_PREFIX,
  VARIABLE_USAGE_MODE,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';
import { FlowNode } from '@domain/flow';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';

type DecisionTableStepProps = {
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
};

const DecisionTableStep = ({
  step,
  resetActiveStepId,
  rfInstance: { getNodes, setNodes }
}: DecisionTableStepProps) => {
  const [noteValue, setNoteValue] = useState('');
  const [columnClickedIndex, setColumnClickedIndex] = useState(0);

  const [caseEntries, setCaseEntries] = useState([
    {
      conditions: [
        {
          name: '',
          operator: '',
          expression: ''
        }
      ],
      actions: [
        {
          name: '',
          operator: '',
          expression: ''
        }
      ]
    }
  ]);

  // otherwise table obj
  const [defaultActions, setDefaultActions] = useState([
    {
      name: '',
      operator: '',
      expression: ''
    }
  ]);

  const value = useContext(DataDictionaryContext);
  const nodes: FlowNode[] = getNodes();

  // temporary combine two groups of variables for autocomplete
  const combinedVariables = value?.variables
    ? [
        ...(value?.variables?.laPMSVariables as DataDictionaryVariable[]),
        ...(value?.variables?.userDefined as UserDefinedVariable[])
      ]
    : [];

  const variablesDataTypes: Record<string, string> = useMemo(
    () =>
      combinedVariables.reduce(
        (acc, current) => ({
          ...acc,
          [current.name]: current.dataType
        }),
        {}
      ),
    [combinedVariables]
  );

  const variablesSourceTypes: Record<string, VARIABLE_SOURCE_TYPE> = useMemo(
    () =>
      combinedVariables.reduce(
        (acc, current) => ({
          ...acc,
          [current.name]: current.sourceType
        }),
        {}
      ),
    [combinedVariables]
  );

  const getColumns = (category: CATEGORIES_WITHOUT_ELSE_ACTIONS) =>
    caseEntries[0][category].map((el) =>
      Object.values(DATA_TYPE_WITH_ENUM_PREFIX).includes(
        variablesDataTypes[el.name] as DATA_TYPE_WITH_ENUM_PREFIX
      )
        ? {
            name: el.name,
            dataType: variablesDataTypes[el.name],
            // if variable enum type we have additional prop with allowedValues
            allowedValues: combinedVariables.find(
              (variable) => variable.name === el.name
            )?.allowedValues
          }
        : {
            name: el.name,
            dataType: variablesDataTypes[el.name]
          }
    );

  // Define rows and columns for the table
  const conditionsColumns: VariableColumnData[] = getColumns(
    CATEGORIES.Conditions
  );
  const actionsColumns: VariableColumnData[] = getColumns(CATEGORIES.Actions);

  const conditionsRows = caseEntries.map((row) =>
    keyBy(row.conditions, 'name')
  );
  const actionsRows = caseEntries.map((row) => keyBy(row.actions, 'name'));
  const defaultActionsRows = [keyBy(defaultActions, 'name')];

  useEffect(() => {
    const { data } = step;

    // if some defaultActions were saved already into the flow

    const savedDefaultActions = data.defaultActions?.length
      ? data.defaultActions.map((column) => ({
          ...column,
          operator: column.expression ? '=' : ''
        }))
      : [
          {
            name: '',
            operator: '',
            expression: ''
          }
        ];

    // if some CaseEntries were saved already into the flow
    const savedCaseEntries = data.caseEntries?.map((row) => {
      const serializedActions = [...row.actions];

      return {
        conditions: row.conditions.length
          ? row.conditions
          : [
              {
                name: '',
                operator: '',
                expression: ''
              }
            ],
        actions: serializedActions.length
          ? serializedActions.map((column) => ({
              ...column,
              operator: column.expression ? '=' : ''
            }))
          : [
              {
                name: '',
                operator: '',
                expression: ''
              }
            ]
      };
    });

    setCaseEntries(
      savedCaseEntries as {
        conditions: CaseEntry[];
        actions: CaseEntry[];
      }[]
    );
    setDefaultActions(savedDefaultActions);

    setNoteValue(data?.note ?? '');
  }, [step.data]);

  const onApplyChangesClick = () => {
    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        node.data = {
          ...node.data,
          note: noteValue,
          caseEntries: getSerializedCaseEntries(caseEntries),
          defaultActions: getSerializedDefaultActions(defaultActions),
          variableSources: setVariableSources({
            caseEntry: caseEntries[0],
            variablesSourceTypes
          })
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
    resetActiveStepId();
  };

  const handleAddNewLayer = () => {
    const newLayerColumns = (existedColumns: VariableColumnData[]) =>
      existedColumns.map((column) => ({
        name: column.name,
        operator: '',
        expression: ''
      }));

    setCaseEntries((prev) => [
      ...prev,
      {
        conditions: newLayerColumns(conditionsColumns),
        actions: newLayerColumns(actionsColumns)
      }
    ]);
  };

  const handleDeleteLayer = (index: number) => {
    const newCaseEntries = [...caseEntries];
    newCaseEntries.splice(index, 1);
    setCaseEntries(newCaseEntries);
  };

  const handleChangeColumnClickedIndex = (newColumnIndex: number) => {
    setColumnClickedIndex(newColumnIndex);
  };

  const handleInsertingColumn = ({
    columnClickedIndex,
    category
  }: {
    columnClickedIndex: number;
    category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  }) => {
    // actions and else actions columns should be identical
    if (category === CATEGORIES.Actions) {
      const newDefaultActionsEntries = [...defaultActions];
      newDefaultActionsEntries.splice(columnClickedIndex + 1, 0, {
        name: '',
        operator: '',
        expression: ''
      });
      setDefaultActions(newDefaultActionsEntries);
    }

    setCaseEntries((prev) =>
      prev.map((row) => {
        const newColumns = [...row[category]];
        newColumns.splice(columnClickedIndex + 1, 0, {
          name: '',
          operator: '',
          expression: ''
        });

        return {
          ...row,
          [category]: newColumns
        };
      })
    );
  };

  const handleDeleteCategoryColumn = ({
    columnIndex,
    category
  }: {
    columnIndex: number;
    category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  }) => {
    if (category === CATEGORIES.Actions) {
      const newDefaultActionsEntries = [...defaultActions];
      newDefaultActionsEntries.splice(columnIndex, 1);
      setDefaultActions(newDefaultActionsEntries);
    }

    setCaseEntries((prev) =>
      prev.map((row) => {
        const newColumns = [...row[category]];
        newColumns.splice(columnIndex, 1);

        return {
          ...row,
          [category]: newColumns
        };
      })
    );
  };

  const handleChangeColumnVariable = ({
    columnIndex,
    newVariable,
    category
  }: {
    columnIndex: number;
    newVariable: Pick<DataDictionaryVariable, 'name'>;
    category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  }) => {
    if (category === CATEGORIES.Actions) {
      const newDefaultActionsEntries = [...defaultActions];
      newDefaultActionsEntries.splice(columnIndex, 1, {
        name: newVariable.name,
        operator: '',
        expression: ''
      });

      setDefaultActions(newDefaultActionsEntries);
    }

    setCaseEntries((prev) =>
      prev.map((row) => {
        const newColumns = [...row[category]];
        newColumns.splice(columnIndex, 1, {
          name: newVariable.name,
          operator: '',
          expression: ''
        });

        return {
          ...row,
          [category]: newColumns
        };
      })
    );
  };

  const handleSubmitVariableValue = ({
    formFieldData,
    category
  }: {
    formFieldData: SelectedCellInRowData & FormFieldsProps;
    category: CATEGORIES;
  }) => {
    const { rowIndex, variableName, operator } = formFieldData;
    if (category === CATEGORIES.DefaultActions) {
      setDefaultActions((prev) =>
        prev.map((column) =>
          column.name !== variableName
            ? column
            : {
                ...column,
                operator: operator,
                expression: formFieldData.value ?? ''
              }
        )
      );
    } else {
      setCaseEntries((prev) =>
        prev.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [category]: row[category as CATEGORIES_WITHOUT_ELSE_ACTIONS].map(
                (column) =>
                  column.name !== variableName
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
        })
      );
    }
  };

  const handleSubmitVariableValueForEnum = ({
    rowIndex,
    variableName,
    newEnumValue,
    category
  }: {
    rowIndex: number;
    variableName: string;
    newEnumValue: string;
    category: CATEGORIES;
  }) => {
    if (category === CATEGORIES.DefaultActions) {
      setDefaultActions((prev) =>
        prev.map((column) =>
          column.name !== variableName
            ? column
            : {
                ...column,
                operator: '=',
                expression: newEnumValue
              }
        )
      );
    } else {
      setCaseEntries((prev) =>
        prev.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              [category]: row[category as CATEGORIES_WITHOUT_ELSE_ACTIONS].map(
                (column) =>
                  column.name !== variableName
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
        })
      );
    }
  };

  if (!value?.variables) return null;

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
          <Stack sx={{ width: 'auto' }}>
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
              rows={conditionsRows}
              variablesOptions={combinedVariables.filter(
                (variable) =>
                  variable.usageMode !== VARIABLE_USAGE_MODE.WriteOnly
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
          <Stack sx={{ width: '100%' }}>
            <StyledStack
              sx={{ borderBottom: '2px solid rgba(209, 217, 226, 0.4)' }}
            >
              Output
            </StyledStack>
            <TableSkeleton
              columns={actionsColumns}
              rows={actionsRows}
              variablesOptions={combinedVariables.filter(
                (variable) =>
                  variable.usageMode !== VARIABLE_USAGE_MODE.ReadOnly
              )}
              columnClickedIndex={columnClickedIndex}
              category={CATEGORIES.Actions}
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
            columns={actionsColumns}
            rows={defaultActionsRows}
            variablesOptions={combinedVariables.filter(
              (variable) => variable.usageMode !== VARIABLE_USAGE_MODE.ReadOnly
            )}
            category={CATEGORIES.DefaultActions}
            handleSubmitVariableValue={handleSubmitVariableValue}
            handleSubmitVariableValueForEnum={handleSubmitVariableValueForEnum}
          />
        </StyledTableContainer>
      </StyledPaper>

      <StepNoteSection noteValue={noteValue} setNoteValue={setNoteValue} />
    </>
  );
};

export default DecisionTableStep;
