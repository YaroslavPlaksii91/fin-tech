import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { Button, Paper } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { debounce, flatMap, isEmpty, keyBy } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { INITIAL_ENTRY, STEP_DETAILS, STEP } from './constants';
import {
  VariableColumnData,
  FormFieldsProps,
  CaseEntries,
  CaseEntry,
  CATEGORIES,
  CATEGORY
} from './types';
import { getColumns, getVariableSources, updateCaseEntry } from './utils';
import Table from './Table/Table';
import validationSchema, { FieldValues } from './validationSchema';

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
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { InputText } from '@components/shared/Forms/InputText';

type DecisionTableStepProps = {
  flow: IFlow;
  mainFlow?: IFlow;
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
  isViewMode: boolean;
};

const DecisionTable = ({
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
  const dataDictionary = useContext(DataDictionaryContext);
  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const user = useAppSelector(selectUserInfo);

  const [isEdited, setIsEdited] = useState(false);
  const [selectedColumn, setSelectedColumn] =
    useState<VariableColumnData | null>(null);
  const [caseEntries, setCaseEntries] = useState<CaseEntries[]>([]);
  const [defaultActions, setDefaultActions] = useState<CaseEntry[]>([]);
  const [stepIds, setStepIds] = useState<(string | null)[]>([]);

  const isPreview = isViewMode || !canUpdateFlow;
  const username = getFullUserName(user);
  const variables = dataDictionary?.variables || {};
  const flatVariables = flatMap(variables);
  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      note: step.data.note ?? ''
    },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
  });

  const watchNote = watch('note');

  const stepOptions = useMemo(
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
    category: CATEGORIES.Actions,
    index: actionsColumns.length
  };

  const columns = [...conditionsColumns, ...actionsColumns];
  const columnsWithStep = [...columns, stepColumn];

  const rows = caseEntries.map((row) => ({
    ...keyBy(row.conditions, 'name'),
    ...keyBy(row.actions, 'name')
  }));

  const elseConditionRow = keyBy(defaultActions, 'name');

  const rowsWithElseCondition = rows.length ? [...rows, elseConditionRow] : [];

  const handleAddNewLayer = () => {
    const addNewLayerColumns = (category: CATEGORY) =>
      columns
        .filter((column) => column.category === category)
        .map((column) => ({
          ...INITIAL_ENTRY,
          name: column.name
        }));

    setCaseEntries((prev) => [
      ...prev,
      {
        conditions: addNewLayerColumns(CATEGORIES.Conditions),
        actions: addNewLayerColumns(CATEGORIES.Actions),
        edgeId: null
      }
    ]);

    setStepIds((prev) => {
      const steps = [...prev];
      steps.splice(prev.length - 1, 0, null);

      return steps;
    });
  };

  const handleDeleteLayer = (index: number) => {
    const newCaseEntries = [...caseEntries];
    newCaseEntries.splice(index, 1);

    setCaseEntries(newCaseEntries);

    if (rows.length === 1) {
      setDefaultActions([]);
      setStepIds([null]);
      return;
    }

    setStepIds((prev) => prev.filter((_, stepIndex) => stepIndex !== index));
  };

  const handleAddColumn = () => {
    if (!selectedColumn?.category) return;
    const isActionsCategory = selectedColumn.category === CATEGORIES.Actions;

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      category: selectedColumn.category,
      start: selectedColumn.index + 1,
      deleteCount: 0,
      insertEntry: INITIAL_ENTRY,
      initialEntries: isActionsCategory
        ? [INITIAL_ENTRY]
        : [INITIAL_ENTRY, INITIAL_ENTRY]
    });

    if (!caseEntries.length) setStepIds([null]);
    if (isActionsCategory)
      setDefaultActions((prev) => [...prev, INITIAL_ENTRY]);

    setCaseEntries(updatedCaseEntries);
  };

  const handleDeleteColumn = () => {
    if (!selectedColumn?.category) return;

    const updatedCaseEntries = updateCaseEntry({
      caseEntries,
      category: selectedColumn.category,
      start: selectedColumn.index,
      deleteCount: 1
    });

    if (selectedColumn.category === CATEGORIES.Actions)
      setDefaultActions((prev) =>
        prev.filter((_, index) => index !== selectedColumn.index)
      );

    setCaseEntries(updatedCaseEntries);
  };

  const handleChangeColumnVariable = (newVariable: DataDictionaryVariable) => {
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

    if (selectedColumn.category === CATEGORIES.Actions)
      setDefaultActions((prev) =>
        prev.map((prevEntry, index) =>
          index === selectedColumn.index ? insertEntry : prevEntry
        )
      );
    setCaseEntries(updatedCaseEntries);
  };

  const handleSubmitVariableValue = (
    data: FormFieldsProps,
    category: CATEGORY,
    rowIndex: number
  ) => {
    if (
      category === CATEGORIES.Actions &&
      rowIndex === rowsWithElseCondition.length - 1
    ) {
      setDefaultActions((prev) =>
        prev.map((prevEntry) =>
          prevEntry.name === data.name
            ? {
                ...prevEntry,
                expression: data.value || '',
                operator: data.operator
              }
            : prevEntry
        )
      );
      return;
    }

    setCaseEntries((prev) =>
      prev.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              [category]: row[category]?.map((column) =>
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
    setStepIds((prev) =>
      prev.map((oldStepId, index) => (rowIndex === index ? stepId : oldStepId))
    );
  };

  const onApplyChangesClick = async ({ note }: FieldValues) => {
    const splitEdges = stepIds.map((targetNodeId, index) => ({
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
          edgeId: splitEdges[caseEntryIndex].target
            ? splitEdges[caseEntryIndex].id
            : null,
          conditions: row.conditions?.map((condition) => ({ ...condition })),
          actions: row.actions?.map((action) => ({
            ...action,
            destinationType: flatVariables.find(
              ({ name }) => action.name === name
            )?.destinationType
          }))
        }));

        const updatedDefaultActions = defaultActions.map((defaultAction) => ({
          ...defaultAction,
          destinationType: flatVariables.find(
            ({ name }) => defaultAction.name === name
          )?.destinationType
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
          defaultEdgeId: splitEdges[splitEdges.length - 1].target
            ? splitEdges[splitEdges.length - 1].id
            : null,
          caseEntries: updatedCaseEntries,
          editedBy: username,
          editedOn: new Date().toISOString(),
          note,
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

    // To make possible setup default Actions for already existed table
    const savedDefaultActions =
      data.defaultActions?.length === 0
        ? (data.caseEntries?.[0]?.actions || []).map((entry) => ({
            ...INITIAL_ENTRY,
            name: entry.name
          }))
        : data.defaultActions;

    return {
      savedDefaultStepId,
      savedDefaultActions,
      savedStepIds: savedStepIds,
      savedCaseEntries: data.caseEntries,
      savedNote: data.note || ''
    };
  }, [step]);

  const setInitialData = useCallback(() => {
    if (initialData) {
      setStepIds([
        ...(initialData?.savedStepIds || []),
        initialData.savedDefaultStepId
      ]);
      setCaseEntries(initialData.savedCaseEntries || []);
      setDefaultActions(initialData.savedDefaultActions || []);
      setValue('note', initialData.savedNote);
    }
  }, [initialData]);

  useEffect(() => setInitialData(), [step.data]);

  const checkIsDirty = (
    caseEntries: CaseEntries[],
    defaultActions: CaseEntry[],
    noteValue: string | null,
    stepIds: (string | null)[]
  ) => {
    const hasChangesInCaseEntries =
      JSON.stringify(initialData?.savedCaseEntries) !==
      JSON.stringify(caseEntries);

    const hasChangesInDefaultActions =
      JSON.stringify(initialData?.savedDefaultActions) !==
      JSON.stringify(defaultActions);

    const hasChangesDefaultStepId =
      initialData?.savedDefaultStepId !== stepIds[stepIds.length - 1];

    const hasChangesNoteValue = (step.data.note ?? '') !== noteValue;

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

  const debounceCheckIsDirty = useCallback(debounce(checkIsDirty, 300), [
    step.data
  ]);

  useEffect(() => {
    debounceCheckIsDirty(caseEntries, defaultActions, watchNote, stepIds);
  }, [caseEntries, defaultActions, stepIds, watchNote]);

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
            stepIds={stepIds}
            columns={columnsWithStep}
            rows={rowsWithElseCondition}
            variables={variables}
            stepOptions={stepOptions}
            selectedColumn={selectedColumn}
            handleChangeStep={handleChangeStep}
            handleSelectionColumn={setSelectedColumn}
            handleDeleteRow={handleDeleteLayer}
            handleAddColumn={handleAddColumn}
            handleDeleteColumn={handleDeleteColumn}
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
          <form>
            <NoteSection>
              <InputText
                fullWidth
                name="note"
                control={control}
                label="Note"
                placeholder="Enter note here"
              />
            </NoteSection>
          </form>
        )}
      </StepContentWrapper>
      <StepDetailsControlBar
        disabled={!isEmpty(errors) || isSubmitting}
        isEdited={isEdited}
        resetActiveStepId={resetActiveStepId}
        onApplyChangesClick={() => {
          void handleSubmit(onApplyChangesClick)();
        }}
        isShow={!isPreview}
      />
    </>
  );
};

export default DecisionTable;
