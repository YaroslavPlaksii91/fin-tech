import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import {
  Button,
  Paper,
  TableContainer,
  TextField,
  Typography
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { flatMap, keyBy, mapValues, filter, cloneDeep, last } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { CATEGORIES, CATEGORIES_TYPE } from './constants';
import {
  VariableColumnDataUpdate,
  SelectedCellInRowData,
  FormFieldsProps,
  CaseEntriesDataUpdate,
  CaseEntryUpdate
} from './types';
import TableSkeleton from './TableSkeleton/TableSkeleton';
import StepNoteSection from './StepNoteSection/StepNoteSection';
import { setVariableSources } from './utils';

import {
  ADD_BUTTON_ON_EDGE,
  CustomReactFlowInstance
} from '@components/FlowManagment/FlowChart/types';
import { FlowNode, IFlow } from '@domain/flow';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';
import { getConnectableNodes } from '@views/ChampionChallenger/utils';
import { flowService } from '@services/flow-service';
import { theme } from '@theme';
import PlusSquareIcon from '@icons/plusSquare.svg';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { StyledStepWrapper } from '@components/Layouts/styled';
import Dialog from '@components/shared/Modals/Dialog';
import { SNACK_TYPE } from '@constants/common';
import {
  DataDictionaryVariable,
  DATA_TYPE_WITH_ENUM_PREFIX,
  VARIABLE_USAGE_MODE,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';

type DecisionTableStepProps = {
  step: FlowNode;
  flow: IFlow;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
};

const INITIAL_ENTRY = {
  name: '',
  operator: '',
  expression: ''
};

const INITAL_CASE_ENTRIES: CaseEntriesDataUpdate = {
  conditions: [],
  actions: [],
  defaultActions: []
};

const DecisionTableStep = ({
  step,
  flow,
  resetActiveStepId,
  rfInstance: { getNodes, getEdges, setNodes, setEdges, onAddNodeBetweenEdges }
}: DecisionTableStepProps) => {
  const [noteValue, setNoteValue] = useState('');
  const [selectedColumn, setSelectedColumn] =
    useState<VariableColumnDataUpdate | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CATEGORIES_TYPE | null>(null);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openDiscardModal, setOpenDiscardModal] = useState(false);

  const [caseEntries, setCaseEntries] = useState<CaseEntriesDataUpdate[]>([
    INITAL_CASE_ENTRIES
  ]);

  const [defaultActions, setDefaultActions] = useState([INITIAL_ENTRY]);

  const [steps, setSteps] = useState<
    {
      rowIndex: number;
      edgeId: string | null;
    }[]
  >([]);

  const dataDictionary = useContext(DataDictionaryContext);

  const variables = dataDictionary?.variables || {};
  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  // temporary combine variables for autocomplete
  const combinedVariables = flatMap(variables);

  const filteredVariables = useMemo(() => {
    let usageMode: VARIABLE_USAGE_MODE;

    switch (selectedColumn?.category) {
      case CATEGORIES.Conditions:
        usageMode = VARIABLE_USAGE_MODE.WriteOnly;
        break;
      case CATEGORIES.DefaultActions:
      case CATEGORIES.Actions:
        usageMode = VARIABLE_USAGE_MODE.ReadOnly;
        break;
    }

    return mapValues(variables, (arr) =>
      filter(arr, (item) => item.usageMode !== usageMode)
    );
  }, [selectedColumn?.category, variables]);

  const searchableSelectOptions = useMemo(
    () =>
      getConnectableNodes(nodes, step.id).map((node) => ({
        value: node.id,
        label: node.data.name
      })),
    [edges, nodes, step.id]
  );

  const variablesDataTypes = useMemo<Record<string, string>>(
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

  const variablesSourceTypes = useMemo<Record<string, VARIABLE_SOURCE_TYPE>>(
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

  const getColumns = (category: CATEGORIES_TYPE) =>
    caseEntries[0][category].map((el) => {
      const isDataTypeWithEnum = Object.values<string>(
        DATA_TYPE_WITH_ENUM_PREFIX
      ).includes(variablesDataTypes[el.name]);

      return {
        ...el,
        category,
        name: el.name,
        dataType: variablesDataTypes[el.name],
        // if variable enum type we have additional prop with allowedValues
        allowedValues: isDataTypeWithEnum
          ? combinedVariables.find((variable) => variable.name === el.name)
              ?.allowedValues
          : undefined
      };
    });

  const stepColumn = {
    name: 'Step',
    dataType: '',
    category: 'step' as CATEGORIES,
    index: 0
  };

  const columns = [
    ...getColumns(CATEGORIES.Conditions),
    ...getColumns(CATEGORIES.Actions)
  ];

  const columnsToShow = [...columns, stepColumn].map((column, index) => ({
    ...column,
    index
  }));

  const rows = caseEntries.map((row) => ({
    ...keyBy(row.conditions, 'name'),
    ...keyBy(row.actions, 'name')
  }));

  // const defaultActionsRows = [keyBy(defaultActions, 'name')];

  const handleOpenNoteModal = () => setOpenNoteModal(true);
  const handleCloseNoteModal = () => setOpenNoteModal(false);

  const handleSubmitNote = (note: string) => {
    setNoteValue(note);
    setOpenNoteModal(false);

    setSelectedCategory(null);
  };

  const handleDiscardChanges = () => resetActiveStepId();

  const handleAddNewLayer = () => {
    const addNewLayerColumns = (
      existedColumns: CaseEntryUpdate[],
      category: CATEGORIES_TYPE
    ) =>
      existedColumns
        .filter((column) => column.category === category)
        .map((column) => ({
          ...INITIAL_ENTRY,
          name: column.name
        }));

    setCaseEntries((prev) => [
      ...prev,
      {
        defaultActions: [],
        conditions: addNewLayerColumns(columns, 'conditions'),
        actions: addNewLayerColumns(columns, 'actions'),
        edgeId: null
      }
    ]);

    // setSteps((prev) => [...prev, { rowIndex: prev.length, edgeId: null }]);
  };

  const handleDeleteLayer = (index: number) => {
    const newCaseEntries = [...caseEntries];
    newCaseEntries.splice(index, 1);

    setCaseEntries(newCaseEntries);
    // setSteps((prev) => prev.filter((step) => step.rowIndex !== index));
  };

  const handleInsertingColumn = () => {
    if (!selectedColumn) return;

    // if (selectedCategory === CATEGORIES.Actions) {
    //   const newDefaultActionsEntries = [...defaultActions];
    //   newDefaultActionsEntries.splice(
    //     selectedColumn!.index + 1,
    //     0,
    //     INITIAL_ENTRY
    //   );
    //   setDefaultActions(newDefaultActionsEntries);
    // }

    setCaseEntries((prev) =>
      prev.map((row) => {
        const newColumns = [...row[selectedColumn.category]];

        newColumns.splice(selectedColumn.index + 1, 0, INITIAL_ENTRY);

        return {
          ...row,
          [selectedColumn.category]: newColumns
        };
      })
    );
  };

  const handleDeleteCategoryColumn = () => {
    if (!selectedCategory) return;

    // if (selectedCategory === CATEGORIES.Actions) {
    //   const newDefaultActionsEntries = [...defaultActions];

    //   newDefaultActionsEntries.splice(selectedColumn!.index, 1);
    //   setDefaultActions(newDefaultActionsEntries);
    // }

    setCaseEntries((prev) =>
      prev.map((row) => {
        const newColumns = [...row[selectedCategory]];
        newColumns.splice(selectedColumn!.index, 1);

        return {
          ...row,
          [selectedCategory]: newColumns
        };
      })
    );
  };

  const handleChangeColumnVariable = (
    newVariable: Pick<DataDictionaryVariable, 'name'>
  ) => {
    if (!selectedCategory) return;
    if (selectedCategory === CATEGORIES.Actions) {
      const newDefaultActionsEntries = [...defaultActions];
      newDefaultActionsEntries.splice(selectedColumn!.index, 1, {
        ...INITIAL_ENTRY,
        name: newVariable.name
      });

      setDefaultActions(newDefaultActionsEntries);
    }

    setCaseEntries((prev) =>
      prev.map((row) => {
        const newColumns = [...row[selectedCategory]];
        newColumns.splice(selectedColumn!.index, 1, {
          ...INITIAL_ENTRY,
          name: newVariable.name
        });

        return {
          ...row,
          [selectedCategory]: newColumns
        };
      })
    );
  };

  const handleSubmitVariableValue = ({
    formFieldData
  }: {
    formFieldData: SelectedCellInRowData & FormFieldsProps;
  }) => {
    if (!selectedCategory) return;

    const { rowIndex, variableName, operator } = formFieldData;

    if (selectedCategory === CATEGORIES.DefaultActions) {
      setDefaultActions((prev) =>
        prev.map((column) =>
          column.name !== variableName
            ? column
            : {
                ...column,
                operator,
                expression: formFieldData.value ?? ''
              }
        )
      );
      return;
    }

    setCaseEntries((prev) =>
      prev.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [selectedCategory]: row[selectedCategory].map((column) =>
              column.name !== variableName
                ? column
                : {
                    ...column,
                    operator,
                    expression: formFieldData.value
                  }
            )
          };
        }
        return row;
      })
    );
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
    if (!selectedCategory) return;

    if (selectedCategory === CATEGORIES.DefaultActions) {
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
      return;
    }

    setCaseEntries((prev) =>
      prev.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [selectedCategory]: row[selectedCategory].map((column) =>
              column.name !== variableName
                ? column
                : {
                    ...column,
                    operator: '=',
                    expression: newEnumValue
                  }
            )
          };
        }

        return row;
      })
    );
  };

  const handleChangeStep = ({
    rowIndex,
    edgeId
  }: {
    rowIndex: number;
    edgeId: string;
  }) => {
    setSteps((prev) =>
      prev.map((step, index) =>
        index === rowIndex ? { ...step, edgeId } : step
      )
    );
  };

  const onApplyChangesClick = async () => {
    const existingEdges = [
      step.data.defaultEdgeId,
      ...(step.data?.caseEntries?.map((entry) => entry.edgeId) || [])
    ];

    const targetNodesIds = steps
      .map((step) => step.edgeId)
      .filter((edgeId) => edgeId) as string[];

    const splitEdges = targetNodesIds.map((targetNodeId, index) => {
      const newEdgeId = uuidv4();
      return {
        id: newEdgeId,
        sourceHandle: index.toString(),
        source: step.id,
        target: targetNodeId,
        type: ADD_BUTTON_ON_EDGE,
        data: { onAdd: onAddNodeBetweenEdges }
      };
    });

    const storedNodes = cloneDeep(nodes);
    const storedEdges = cloneDeep(edges);

    const newEdges = edges
      .filter((edg) => !existingEdges.includes(edg.id))
      .filter((edg) => !targetNodesIds.includes(edg.target))
      .concat(splitEdges);

    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        // This updates data inside the node. Since React Flow uses Zustand under the hood, it is necessary to recreate the data.
        node.data = {
          ...node.data,
          defaultEdgeId: last(steps)?.edgeId || null,
          note: noteValue,
          caseEntries: caseEntries.map((row) => ({
            ...row,
            actions: row.actions.map((column) => ({
              ...column,
              destinationType: 'TemporaryVariable'
            }))
          })),
          defaultActions: defaultActions.map((element) => ({
            ...element,
            destinationType: 'TemporaryVariable'
          })),
          variableSources: setVariableSources(
            [...caseEntries[0].actions, ...caseEntries[0].conditions],
            variablesSourceTypes
          )
        };
      }

      return node;
    });

    try {
      await flowService.validateFlow({
        ...flow,
        nodes: updatedNodes,
        edges: newEdges
      });
      setNodes(updatedNodes);
      setEdges(newEdges);
      enqueueSnackbar(
        <SnackbarMessage
          message="Success"
          details={`Changes for the "${step.data.name}" step were successfully applied.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
      resetActiveStepId();
    } catch (error) {
      setNodes(storedNodes);
      setEdges(storedEdges);
      enqueueSnackbar(<SnackbarErrorMessage message="Error" error={error} />, {
        variant: SNACK_TYPE.ERROR
      });
    }
  };

  const setInitialData = useCallback(() => {
    const { data } = step;

    if (!data.caseEntries) return;

    // if some defaultActions were saved already into the flow
    const savedDefaultActions = data.defaultActions?.map((column) => ({
      ...column,
      operator: column.expression ? '=' : ''
    }));

    // if some CaseEntries were saved already into the flow
    const savedCaseEntries = data.caseEntries.map((row) => ({
      ...row,
      defaultActions: [],
      conditions: row.conditions.length ? row.conditions : [INITIAL_ENTRY],
      actions: row.actions.map((column) => ({
        ...column,
        operator: column.expression ? '=' : ''
      }))
    }));

    setCaseEntries(savedCaseEntries);
    setDefaultActions(savedDefaultActions || []);
    setNoteValue(data.note ?? '');

    setSteps([
      ...data.caseEntries.map((row, i) => ({
        rowIndex: i,
        edgeId: row.edgeId || null
      })),
      { rowIndex: data.caseEntries.length, edgeId: data.defaultEdgeId || null }
    ]);
  }, [step.data]);

  useEffect(() => setInitialData(), [setInitialData]);

  if (!variables) return null;

  return (
    <>
      <StyledStepWrapper>
        <StepDetailsHeader
          title={step.data.name}
          details="A decision table is a step that allows to set expressions for
        columns and rows. The system will go through the table and analyze the
        values."
          isActionContainerVisible={false}
          flow={flow}
        />
        <Paper>
          <TableContainer sx={{ bgcolor: theme.palette.background.default }}>
            <TableSkeleton
              steps={steps}
              columns={columnsToShow}
              rows={rows}
              variables={filteredVariables}
              selectedCategory={selectedCategory}
              searchableSelectOptions={searchableSelectOptions}
              selectedColumn={selectedColumn}
              handleChangeStep={handleChangeStep}
              handleSelectColumn={setSelectedColumn}
              handleDeleteRow={handleDeleteLayer}
              handleInsertingColumn={handleInsertingColumn}
              handleDeleteCategoryColumn={handleDeleteCategoryColumn}
              handleChangeColumnVariable={handleChangeColumnVariable}
              handleSubmitVariableValue={handleSubmitVariableValue}
              handleSubmitVariableValueForEnum={
                handleSubmitVariableValueForEnum
              }
            />
          </TableContainer>
        </Paper>
        <Button
          sx={{ width: 'fit-content', mt: 1 }}
          variant="outlined"
          onClick={handleAddNewLayer}
          startIcon={<PlusSquareIcon />}
        >
          Add new business layer
        </Button>
        <StepNoteSection
          modalOpen={openNoteModal}
          handleCloseModal={handleCloseNoteModal}
          handleOpenModal={handleOpenNoteModal}
          noteValue={noteValue}
          handleSubmitNote={handleSubmitNote}
          renderInput={() => (
            <TextField
              fullWidth
              name="note"
              value={noteValue}
              label="Note"
              size="small"
              disabled
              placeholder="Enter note here"
            />
          )}
        />
      </StyledStepWrapper>
      <StepDetailsControlBar
        onDiscard={() => setOpenDiscardModal(true)}
        onApplyChangesClick={onApplyChangesClick}
      />
      <Dialog
        title="Discard changes"
        open={openDiscardModal}
        onConfirm={handleDiscardChanges}
        onClose={() => setOpenDiscardModal(false)}
        confirmText="Discard changes"
      >
        <Typography sx={{ maxWidth: '416px' }} variant="body2">
          Discarding changes will delete all edits in this step, this action
          cannot be canceled. Are you sure you want to cancel the changes?
        </Typography>
      </Dialog>
    </>
  );
};

export default DecisionTableStep;
