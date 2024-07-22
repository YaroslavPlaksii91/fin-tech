import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { Button, Paper, TableContainer, TextField } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { debounce, keyBy } from 'lodash';
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
import { SNACK_TYPE } from '@constants/common';
import { DataDictionaryVariable } from '@domain/dataDictionary';
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
    useState<VariableColumnDataUpdate | null>(null);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [caseEntries, setCaseEntries] = useState<CaseEntriesDate[]>([]);

  const [defaultActions, setDefaultActions] = useState<CaseEntry[]>([]);

  const [stepIds, setStepIds] = useState<(string | null)[]>([]);
  const [defaultStepId, setDefaultStepId] = useState<string | null>(null);

  const dataDictionary = useContext(DataDictionaryContext);

  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isPreview = isViewMode || !canUpdateFlow;
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
              column.name !== data.name
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

  const initialData = useMemo(() => {
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

    return {
      savedDefaultStepId,
      savedStepIds,
      savedDefaultActions,
      savedCaseEntries,
      savedNote: data.note
    };
  }, [step]);

  const setInitialData = useCallback(() => {
    if (initialData) {
      setStepIds(initialData.savedStepIds);
      setCaseEntries(initialData.savedCaseEntries);
      setDefaultActions(initialData.savedDefaultActions);
      setDefaultStepId(initialData.savedDefaultStepId);
      setNoteValue(initialData.savedNote ?? '');
    }
  }, [initialData]);

  useEffect(() => setInitialData(), [step.data]);

  const checkIsDirty = (
    caseEntries: CaseEntriesDate[],
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

    const hasChangesNoteValue = initialData?.savedNote !== noteValue;

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

  if (!variables) return null;

  return (
    <>
      <StepContentWrapper>
        <StepDetailsHeader
          step={step}
          title={`${isPreview ? 'View' : 'Edit'} Step: ${step.data.name}`}
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
              hasUserPermission={!isPreview}
            />
          </TableContainer>
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
        isEdited={isEdited}
        resetActiveStepId={resetActiveStepId}
        onApplyChangesClick={onApplyChangesClick}
        isShow={!isPreview}
      />
    </>
  );
};

export default DecisionTableStep;
