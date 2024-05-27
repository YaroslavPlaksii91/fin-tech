import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import {
  Button,
  Paper,
  TableContainer,
  TextField,
  Typography
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { keyBy, cloneDeep } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  CATEGORIES,
  CATEGORIES_TYPE,
  CATEGORIES_WITHOUT_ELSE_ACTIONS,
  INITIAL_CASE_ENTRIES,
  INITIAL_ENTRY,
  OPERATORS,
  STEP_DETAILS
} from './constants';
import {
  VariableColumnDataUpdate,
  SelectedCellInRowData,
  FormFieldsProps,
  CaseEntriesDataUpdate,
  CaseEntryUpdate,
  CaseEntry
} from './types';
import {
  filterVariablesByUsageMode,
  getColumns,
  setVariableSources,
  updateCaseEntry
} from './utils';
import TableSkeleton from './Table/Table';
import StepNoteSection from './StepNoteSection/StepNoteSection';

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
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader/StepDetailsHeader';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { StyledStepWrapper } from '@components/Layouts/styled';
import Dialog from '@components/shared/Modals/Dialog';
import { SNACK_TYPE } from '@constants/common';
import { DataDictionaryVariable } from '@domain/dataDictionary';

type DecisionTableStepProps = {
  flow: IFlow;
  mainFlow?: IFlow;
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
};

const DecisionTableStep = ({
  step,
  flow,
  mainFlow,
  resetActiveStepId,
  rfInstance: {
    getNodes,
    getEdge,
    getEdges,
    setNodes,
    setEdges,
    onAddNodeBetweenEdges
  }
}: DecisionTableStepProps) => {
  const [noteValue, setNoteValue] = useState('');
  const [selectedColumn, setSelectedColumn] =
    useState<VariableColumnDataUpdate | null>(null);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openDiscardModal, setOpenDiscardModal] = useState(false);
  const [caseEntries, setCaseEntries] =
    useState<CaseEntriesDataUpdate[]>(INITIAL_CASE_ENTRIES);

  const [defaultEdgeId, setDefaultEdgeId] = useState<string | null>(null);
  const [defaultActions, setDefaultActions] = useState<CaseEntry[]>([]);

  const [steps, setSteps] = useState<(string | null)[]>([]);

  const dataDictionary = useContext(DataDictionaryContext);

  const variables = dataDictionary?.variables || {};
  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  // temporary combine variables for autocomplete
  const filteredVariables = filterVariablesByUsageMode(
    variables,
    selectedColumn?.category
  );

  const searchableSelectOptions = useMemo(
    () =>
      getConnectableNodes(nodes, step.id).map((node) => ({
        value: node.id,
        label: node.data.name
      })),
    [nodes.length, step.id]
  );

  const conditionsColumns = getColumns(
    caseEntries[0],
    variables,
    CATEGORIES.Conditions
  );

  const actionsColumns = getColumns(
    caseEntries[0],
    variables,
    CATEGORIES.Actions
  );

  const stepColumn = {
    name: 'Step',
    dataType: '',
    category: CATEGORIES.Actions as CATEGORIES_WITHOUT_ELSE_ACTIONS,
    index: actionsColumns.length
  };

  const columns = [...conditionsColumns, ...actionsColumns];
  const columnsToShow = [...columns, stepColumn];

  const rows = caseEntries.map((row) => ({
    ...keyBy(row.conditions, 'name'),
    ...keyBy(row.actions, 'name')
  }));

  const rowsToShow = rows.length
    ? [...rows, ...[keyBy(defaultActions, 'name')]]
    : [];

  const handleOpenNoteModal = () => setOpenNoteModal(true);
  const handleCloseNoteModal = () => setOpenNoteModal(false);

  const handleSubmitNote = (note: string) => {
    setNoteValue(note);
    setOpenNoteModal(false);
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
        conditions: addNewLayerColumns(columns, 'conditions'),
        actions: addNewLayerColumns(columns, 'actions'),
        edgeId: null
      }
    ]);

    setSteps((prev) => [...prev, null]);
  };

  const handleDeleteLayer = (index: number) => {
    const newCaseEntries = [...caseEntries];
    newCaseEntries.splice(index, 1);

    setCaseEntries(newCaseEntries);

    if (steps.length <= 1) setDefaultEdgeId(null);

    setSteps((prev) => prev.filter((_, stepIndex) => stepIndex !== index));
  };

  const handleInsertColumn = () => {
    if (!selectedColumn) return;

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      selectedColumn,
      start: selectedColumn.index + 1,
      deleteCount: 0,
      insertEntry: INITIAL_ENTRY
    });

    setCaseEntries(updatedCaseEntries);
  };

  const handleDeleteCategoryColumn = () => {
    if (!selectedColumn) return;

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      selectedColumn,
      start: selectedColumn.index,
      deleteCount: 1
    });

    setCaseEntries(updatedCaseEntries);
  };

  const handleChangeColumnVariable = (
    newVariable: Pick<DataDictionaryVariable, 'name'>
  ) => {
    if (!selectedColumn) return;

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      selectedColumn,
      start: selectedColumn.index,
      deleteCount: 1,
      insertEntry: {
        ...INITIAL_ENTRY,
        name: newVariable.name
      }
    });

    setCaseEntries(updatedCaseEntries);
  };

  const handleSubmitVariableValue = (
    data: SelectedCellInRowData & FormFieldsProps
  ) => {
    const expression =
      data.operator === OPERATORS.Between
        ? `${data.upperBound} ${data.lowerBound}`
        : data.value;

    setCaseEntries((prev) =>
      prev.map((row, index) => {
        if (index === data.rowIndex)
          return {
            ...row,
            [data.category]: row[data.category].map((column) =>
              column.name !== data.variableName
                ? column
                : {
                    ...column,
                    expression,
                    operator: data.operator
                  }
            )
          };

        return row;
      })
    );
  };

  const handleChangeStep = (rowIndex: number, edgeId: string) => {
    if (rowIndex >= steps.length) {
      setDefaultEdgeId(edgeId);
      return;
    }

    setSteps((prev) =>
      prev.map((step, index) => (rowIndex === index ? edgeId : step))
    );
  };

  const onApplyChangesClick = async () => {
    const existingEdges = [
      ...(step.data.caseEntries?.map((entry) => entry.edgeId) || []),
      step.data.defaultEdgeId
    ];

    const targetNodesIds = [...steps, defaultEdgeId].filter(
      (edgeId) => edgeId
    ) as string[];

    const splitEdges = targetNodesIds.map((targetNodeId, index) => ({
      id: uuidv4(),
      sourceHandle: index.toString(),
      source: step.id,
      target: targetNodeId,
      type: ADD_BUTTON_ON_EDGE,
      data: { onAdd: onAddNodeBetweenEdges }
    }));

    const storedNodes = cloneDeep(nodes);
    const storedEdges = cloneDeep(edges);

    const newEdges = edges
      .filter((edg) => !existingEdges.includes(edg.id))
      .filter((edg) => !targetNodesIds.includes(edg.target))
      .concat(splitEdges);

    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id)
        return {
          ...node,
          data: {
            ...node.data,
            defaultEdgeId: (steps.length && splitEdges.pop()?.id) || null,
            note: noteValue,
            caseEntries: caseEntries.map((row, caseEntryIndex) => ({
              ...row,
              edgeId:
                splitEdges.find((_, index) => index === caseEntryIndex)?.id ||
                row.edgeId,
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
              [
                ...(caseEntries[0]?.actions || []),
                ...(caseEntries[0]?.conditions || [])
              ],
              variables
            )
          }
        };

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

    const savedDefaultEdgeId =
      getEdge(data.defaultEdgeId || '')?.target || null;

    const savedSteps = data.caseEntries.map((entry) => {
      const connectedEdges = getEdge(entry.edgeId || '');

      return connectedEdges?.target || null;
    });

    // if some defaultActions were saved already into the flow
    const savedDefaultActions =
      data.defaultActions?.map((column) => ({
        ...column,
        operator: column.expression ? '=' : ''
      })) || [];

    // if some CaseEntries were saved already into the flow
    const savedCaseEntries = data.caseEntries.map((row) => ({
      ...row,
      actions: row.actions.map((column) => ({
        ...column,
        operator: column.expression ? '=' : ''
      }))
    }));

    setSteps(savedSteps);
    setCaseEntries(savedCaseEntries);
    setDefaultActions(savedDefaultActions);
    setDefaultEdgeId(savedDefaultEdgeId);
    setNoteValue(data.note ?? '');
  }, [step.data]);

  useEffect(() => setInitialData(), [setInitialData]);

  if (!variables) return null;

  return (
    <>
      <StyledStepWrapper>
        <StepDetailsHeader
          flow={mainFlow ?? flow}
          step={step}
          title={`Edit Step: ${step.data.name}`}
          details={STEP_DETAILS}
          isActionContainerVisible={false}
        />
        <Paper>
          <TableContainer sx={{ bgcolor: theme.palette.background.default }}>
            <TableSkeleton
              defaultStep={defaultEdgeId}
              steps={steps}
              columns={columnsToShow}
              rows={rowsToShow}
              variables={filteredVariables}
              searchableSelectOptions={searchableSelectOptions}
              selectedColumn={selectedColumn}
              handleChangeStep={handleChangeStep}
              handleSelectionColumn={setSelectedColumn}
              handleDeleteRow={handleDeleteLayer}
              handleInsertColumn={handleInsertColumn}
              handleDeleteCategoryColumn={handleDeleteCategoryColumn}
              handleChangeColumnVariable={handleChangeColumnVariable}
              handleSubmitVariableValue={handleSubmitVariableValue}
            />
          </TableContainer>
        </Paper>
        <Button
          sx={{ width: 'fit-content', mt: 1 }}
          variant="outlined"
          onClick={handleAddNewLayer}
          startIcon={<PlusSquareIcon />}
          disabled={rowsToShow.length >= searchableSelectOptions.length}
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
