import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { Button, Paper, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { debounce, flatMap, keyBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  CATEGORIES,
  CATEGORY,
  CATEGORIES_WITHOUT_DEFAULT_ACTIONS,
  INITIAL_ENTRY,
  STEP_DETAILS,
  STEP
} from './constants';
import {
  VariableColumnData,
  SelectedCell,
  FormFieldsProps,
  CaseEntries,
  CaseEntryColumn,
  CaseEntry
} from './types';
import { getColumns, getVariableSources, updateCaseEntry } from './utils';
import Table from './Table/Table';

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
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { SNACK_TYPE } from '@constants/common';
import {
  DATA_TYPE_WITHOUT_ENUM,
  DataDictionaryVariable
} from '@domain/dataDictionary';
import { StepContentWrapper } from '@views/styled';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';
import { selectUserInfo } from '@store/auth/auth';
import { useAppSelector } from '@store/hooks';
import { getFullUserName } from '@utils/helpers';
import { useIsDirty } from '@contexts/IsDirtyContext';

type DecisionTableStepProps = {
  flow: IFlow;
  mainFlow?: IFlow;
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
  isViewMode: boolean;
};

const DecisionTableStep = ({
  step,
  flow,
  mainFlow,
  resetActiveStepId,
  isViewMode,
  rfInstance: {
    getNodes,
    getEdge,
    getEdges,
    setNodes,
    setEdges,
    onAddNodeBetweenEdges
  }
}: DecisionTableStepProps) => {
  const { setIsDirty } = useIsDirty();
  const [isEdited, setIsEdited] = useState(false);

  const [noteValue, setNoteValue] = useState('');
  const [selectedColumn, setSelectedColumn] =
    useState<VariableColumnData | null>(null);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [caseEntries, setCaseEntries] = useState<CaseEntries[]>([]);

  const [defaultActions, setDefaultActions] = useState<CaseEntry[]>([]);

  const [stepIds, setStepIds] = useState<(string | null)[]>([]);
  const [defaultStepId, setDefaultStepId] = useState<string | null>(null);

  const dataDictionary = useContext(DataDictionaryContext);

  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isPreview = isViewMode || !canUpdateFlow;
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);

  const variables = dataDictionary?.variables || {};
  const flatVariables = flatMap(variables);
  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  const stepsOptions = useMemo(
    () =>
      getConnectableNodes(nodes, step.id).map((node) => ({
        value: node.id,
        label: node.data.name
      })),
    [nodes.length, step.id]
  );

  const conditionsColumns = getColumns(
    caseEntries[0],
    flatVariables,
    CATEGORIES.Conditions
  );

  const actionsColumns = getColumns(
    caseEntries[0],
    flatVariables,
    CATEGORIES.Actions
  );

  const stepColumn = {
    name: STEP,
    dataType: DATA_TYPE_WITHOUT_ENUM.String,
    category: CATEGORIES.Actions as CATEGORIES_WITHOUT_DEFAULT_ACTIONS,
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

  const handleAddNewLayer = () => {
    const addNewLayerColumns = (
      existedColumns: CaseEntryColumn[],
      category: CATEGORY
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
        conditions: addNewLayerColumns(columns, CATEGORIES.Conditions),
        actions: addNewLayerColumns(columns, CATEGORIES.Actions),
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

  const handleSubmitVariableValue = (data: SelectedCell & FormFieldsProps) => {
    setCaseEntries((prev) =>
      prev.map((row, index) =>
        index === data.rowIndex
          ? {
              ...row,
              [data.category]: row[data.category].map((column) =>
                column.name !== data.name
                  ? column
                  : {
                      ...column,
                      expression: data.value,
                      operator: data.operator
                    }
              )
            }
          : row
      )
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

        const updatedVariableSources = getVariableSources(
          [
            ...(caseEntries[0]?.actions || []),
            ...(caseEntries[0]?.conditions || [])
          ],
          flatVariables
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

  const initialData = useMemo(() => {
    const { data } = step;

    const savedDefaultStepId =
      getEdge(data.defaultEdgeId || '')?.target || null;

    const savedStepIds = data.caseEntries?.map((entry) => {
      const connectedEdge = getEdge(entry.edgeId || '');

      return connectedEdge?.target || null;
    });

    return {
      savedDefaultStepId,
      savedStepIds: savedStepIds || [],
      savedDefaultActions: data.defaultActions || [],
      savedCaseEntries: data.caseEntries || [],
      savedNote: data.note || ''
    };
  }, [step]);

  const setInitialData = useCallback(() => {
    if (initialData) {
      setStepIds(initialData.savedStepIds);
      setCaseEntries(initialData.savedCaseEntries);
      setDefaultActions(initialData.savedDefaultActions);
      setDefaultStepId(initialData.savedDefaultStepId);
      setNoteValue(initialData.savedNote);
    }
  }, [initialData]);

  useEffect(() => setInitialData(), [step.data]);

  const checkIsDirty = (
    caseEntries: CaseEntries[],
    defaultActions: CaseEntry[],
    defaultStepId: string | null,
    noteValue: string,
    stepIds: (string | null)[]
  ) => {
    const hasChangesInCaseEntries =
      JSON.stringify(initialData?.savedCaseEntries) !==
      JSON.stringify(caseEntries);

    const hasChangesInDefaultActions =
      JSON.stringify(initialData?.savedDefaultActions) !==
      JSON.stringify(defaultActions);

    const hasChangesDefaultStepId =
      initialData?.savedDefaultStepId !== defaultStepId;

    const hasChangesNoteValue = (initialData?.savedNote ?? '') !== noteValue;

    const hasChangesStepIds =
      JSON.stringify(initialData?.savedStepIds) !== JSON.stringify(stepIds);

    const isEdit =
      hasChangesInCaseEntries ||
      hasChangesInDefaultActions ||
      hasChangesDefaultStepId ||
      hasChangesNoteValue ||
      hasChangesStepIds;

    if (isEdit) {
      setIsEdited(true);
    } else {
      setIsEdited(false);
    }
  };

  const debounceCheckIsDirty = useCallback(debounce(checkIsDirty, 300), []);

  useEffect(() => {
    debounceCheckIsDirty(
      caseEntries,
      defaultActions,
      defaultStepId,
      noteValue,
      stepIds
    );
  }, [caseEntries, defaultActions, defaultStepId, noteValue, stepIds]);

  useEffect(() => {
    setIsDirty(isEdited);
  }, [isEdited]);

  return (
    <>
      <StepContentWrapper>
        <StepDetailsHeader
          step={step}
          title={`${isPreview ? 'View' : 'Edit'} Step: ${step.data.name}`}
          details={STEP_DETAILS}
        />
        <Paper
          elevation={0}
          sx={{
            bgcolor: theme.palette.background.default,
            overflow: 'auto'
          }}
        >
          <Table
            hasUserPermission={!isPreview}
            defaultStepId={defaultStepId}
            stepIds={stepIds}
            columns={columnsToShow}
            rows={rowsToShow}
            variables={variables}
            stepsOptions={stepsOptions}
            selectedColumn={selectedColumn}
            handleChangeStep={handleChangeStep}
            handleSelectionColumn={setSelectedColumn}
            handleDeleteRow={handleDeleteLayer}
            handleInsertColumn={handleInsertColumn}
            handleDeleteCategoryColumn={handleDeleteCategoryColumn}
            handleChangeColumnVariable={handleChangeColumnVariable}
            handleSubmitVariableValue={handleSubmitVariableValue}
          />
        </Paper>
        {!isPreview && (
          <Button
            sx={{ width: 'fit-content', mt: 1 }}
            variant="outlined"
            onClick={handleAddNewLayer}
            startIcon={<PlusSquareIcon />}
          >
            Add new business layer
          </Button>
        )}
        {!isPreview && (
          <NoteSection
            modalOpen={openNoteModal}
            value={noteValue}
            handleClose={handleCloseNoteModal}
            handleOpen={handleOpenNoteModal}
            handleSubmit={handleSubmitNote}
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
        isEdited={isEdited}
        resetActiveStepId={resetActiveStepId}
        onApplyChangesClick={onApplyChangesClick}
        isShow={!isPreview}
      />
    </>
  );
};

export default DecisionTableStep;
