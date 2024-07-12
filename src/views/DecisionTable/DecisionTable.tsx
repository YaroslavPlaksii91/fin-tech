import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import {
  Button,
  Paper,
  TableContainer,
  TextField,
  Typography
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { keyBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  CATEGORIES,
  CATEGORIES_TYPE,
  CATEGORIES_WITHOUT_ELSE_ACTIONS,
  INITIAL_ENTRY,
  OPERATORS,
  STEP_DETAILS
} from './constants';
import {
  VariableColumnDataUpdate,
  SelectedCellInRowData,
  FormFieldsProps,
  CaseEntriesDate,
  CaseEntryColumn,
  CaseEntry
} from './types';
import {
  filterVariablesByUsageMode,
  getColumns,
  setVariableSources,
  updateCaseEntry
} from './utils';
import Table from './Table/Table';
import StepNoteSection from './StepNoteSection/StepNoteSection';

import {
  ADD_BUTTON_ON_EDGE,
  CustomReactFlowInstance
} from '@components/FlowManagment/FlowChart/types';
import { FlowNode, IFlow } from '@domain/flow';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';
import {
  formatFlowDataForValidation,
  getConnectableNodes
} from '@views/ChampionChallenger/utils';
import { flowService } from '@services/flow-service';
import { theme } from '@theme';
import PlusSquareIcon from '@icons/plusSquare.svg';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader/StepDetailsHeader';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import Dialog from '@components/shared/Modals/Dialog';
import { SNACK_TYPE } from '@constants/common';
import { DataDictionaryVariable } from '@domain/dataDictionary';
import { StepContentWrapper } from '@views/styled';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';
import { useViewMode } from '@hooks/useViewMode';
import { selectUserInfo } from '@store/auth/auth';
import { useAppSelector } from '@store/hooks';
import { getFullUserName } from '@utils/helpers';

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
  const [caseEntries, setCaseEntries] = useState<CaseEntriesDate[]>([]);

  const [defaultActions, setDefaultActions] = useState<CaseEntry[]>([]);

  const [stepIds, setStepIds] = useState<(string | null)[]>([]);
  const [defaultStepId, setDefaultStepId] = useState<string | null>(null);

  const dataDictionary = useContext(DataDictionaryContext);

  const viewMode = useViewMode();
  const hasUserPermission = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isViewMode = viewMode || !hasUserPermission;
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);

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
      existedColumns: CaseEntryColumn[],
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

    setStepIds((prev) => [...prev, null]);
  };

  const handleDeleteLayer = (index: number) => {
    const newCaseEntries = [...caseEntries];
    newCaseEntries.splice(index, 1);

    setCaseEntries(newCaseEntries);

    if (stepIds.length <= 1) setDefaultStepId(null);

    setStepIds((prev) => prev.filter((_, stepIndex) => stepIndex !== index));
  };

  const handleInsertColumn = () => {
    if (!selectedColumn?.category) return;

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      category: selectedColumn.category,
      start: selectedColumn.index + 1,
      deleteCount: 0,
      insertEntry: INITIAL_ENTRY,
      initialEntries:
        selectedColumn.category === CATEGORIES.Actions
          ? [INITIAL_ENTRY]
          : [INITIAL_ENTRY, INITIAL_ENTRY]
    });

    if (!caseEntries.length) {
      setStepIds([null]);
      setDefaultStepId(null);
    }

    setCaseEntries(updatedCaseEntries);
  };

  const handleDeleteCategoryColumn = () => {
    if (!selectedColumn?.category) return;

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      category: selectedColumn.category,
      start: selectedColumn.index,
      deleteCount: 1
    });

    setCaseEntries(updatedCaseEntries);
  };

  const handleChangeColumnVariable = (
    newVariable: Pick<DataDictionaryVariable, 'name'>
  ) => {
    if (!selectedColumn?.category) return;

    const insertEntry = {
      ...INITIAL_ENTRY,
      name: newVariable.name
    };

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      category: selectedColumn.category,
      start: selectedColumn.index,
      deleteCount: 1,
      insertEntry,
      initialEntries: [insertEntry]
    });

    if (!caseEntries.length) {
      setStepIds([null]);
      setDefaultStepId(null);
    }

    setCaseEntries(updatedCaseEntries);
  };

  const handleSubmitVariableValue = (
    data: SelectedCellInRowData & FormFieldsProps
  ) => {
    const expression =
      data.operator === OPERATORS.Between
        ? `${data.lowerBound} ${data.upperBound}`
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

  const handleChangeStep = (rowIndex: number, stepId: string) => {
    if (rowIndex >= stepIds.length) {
      setDefaultStepId(stepId);
      return;
    }

    setStepIds((prev) =>
      prev.map((oldStepId, index) => (rowIndex === index ? stepId : oldStepId))
    );
  };

  const onApplyChangesClick = async () => {
    const targetNodesIds = [...stepIds, defaultStepId];

    const splitEdges = targetNodesIds.map((targetNodeId, index) => ({
      id: uuidv4(),
      sourceHandle: index.toString(),
      source: step.id,
      target: targetNodeId as string,
      type: ADD_BUTTON_ON_EDGE,
      data: { onAdd: onAddNodeBetweenEdges }
    }));

    const filteredSplitEdges = splitEdges.filter(
      (splitEdge) => splitEdge.target
    );

    const newEdges = edges
      .filter((edg) => edg.source !== step.id)
      .concat(filteredSplitEdges);

    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        const updatedCaseEntries = caseEntries.map((row, caseEntryIndex) => ({
          edgeId: splitEdges[caseEntryIndex]?.id || null,
          conditions: row.conditions.map((condition) => ({ ...condition })),
          actions: row.actions.map((action) => ({
            ...action,
            destinationType: 'TemporaryVariable'
          }))
        }));

        const updatedDefaultActions = defaultActions.map((defaultAction) => ({
          ...defaultAction,
          destinationType: 'TemporaryVariable'
        }));

        const updatedVariableSources = setVariableSources(
          [
            ...(caseEntries[0]?.actions || []),
            ...(caseEntries[0]?.conditions || [])
          ],
          variables
        );

        node.data = {
          ...node.data,
          defaultEdgeId: defaultStepId
            ? splitEdges[splitEdges.length - 1].id
            : null,
          caseEntries: updatedCaseEntries,
          editedBy: username,
          editedOn: new Date().toISOString(),
          note: noteValue,
          defaultActions: updatedDefaultActions,
          variableSources: updatedVariableSources
        };
      }

      return node;
    });

    try {
      const data = formatFlowDataForValidation(
        mainFlow,
        flow,
        updatedNodes,
        newEdges
      );
      await flowService.validateFlow(data);

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
      enqueueSnackbar(<SnackbarErrorMessage message="Error" error={error} />, {
        variant: SNACK_TYPE.ERROR
      });
    }
  };

  const setInitialData = useCallback(() => {
    const { data } = step;

    if (!data.caseEntries) return;

    const savedDefaultStepId =
      getEdge(data.defaultEdgeId || '')?.target || null;

    const savedStepIds = data.caseEntries.map((entry) => {
      const connectedEdge = getEdge(entry.edgeId || '');

      return connectedEdge?.target || null;
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

    setStepIds(savedStepIds);
    setCaseEntries(savedCaseEntries);
    setDefaultActions(savedDefaultActions);
    setDefaultStepId(savedDefaultStepId);
    setNoteValue(data.note ?? '');
  }, [step]);

  useEffect(() => setInitialData(), [step.data]);

  if (!variables) return null;

  return (
    <>
      <StepContentWrapper>
        <StepDetailsHeader
          step={step}
          title={`${isViewMode ? 'View' : 'Edit'} Step: ${step.data.name}`}
          details={STEP_DETAILS}
        />
        <Paper>
          <TableContainer sx={{ bgcolor: theme.palette.background.default }}>
            <Table
              defaultStepId={defaultStepId}
              stepIds={stepIds}
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
              hasUserPermission={!isViewMode}
            />
          </TableContainer>
        </Paper>

        {!isViewMode && (
          <Button
            sx={{ width: 'fit-content', mt: 1 }}
            variant="outlined"
            onClick={handleAddNewLayer}
            startIcon={<PlusSquareIcon />}
          >
            Add new business layer
          </Button>
        )}

        {!isViewMode && (
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
        )}
      </StepContentWrapper>
      <StepDetailsControlBar
        onDiscard={() => setOpenDiscardModal(true)}
        onApplyChangesClick={onApplyChangesClick}
        isShow={!isViewMode}
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
