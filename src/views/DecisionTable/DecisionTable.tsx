import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Paper } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import * as _ from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  INITIAL_ENTRY,
  STEP_DETAILS,
  STEP,
  INITIAL_CASE_ENTRIES
} from './constants';
import {
  ColumnData,
  FormFieldsProps,
  CaseEntry,
  CATEGORIES,
  CATEGORY,
  SelectedCell,
  VALUE_TYPES
} from './types';
import { getColumns, getVariableSources, updateCaseEntry } from './utils';
import Table from './Table/Table';
import validationSchema, { FieldValues } from './validationSchema';

import {
  ADD_BUTTON_ON_EDGE,
  CustomReactFlowInstance
} from '@components/FlowManagment/FlowChart/types';
import { FlowNode, IFlow } from '@domain/flow';
import {
  formatFlowDataForValidation,
  getConnectableNodes
} from '@views/ChampionChallenger/utils';
import { flowService } from '@services/flow-service';
import { customBoxShadows, theme } from '@theme';
import PlusSquareIcon from '@icons/plusSquare.svg';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader/StepDetailsHeader';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar';
import Message from '@components/shared/Snackbar/Message';
import ErrorMessage from '@components/shared/Snackbar/ErrorMessage';
import ConditionsCard from '@views/DecisionTable/ConditionsCard';
import { SNACK_TYPE } from '@constants/common';
import {
  VARIABLE_DATA_TYPE,
  DataDictionaryVariable
} from '@domain/dataDictionary';
import { StepContentWrapper } from '@views/styled';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';
import { selectUserInfo } from '@store/auth';
import { useAppSelector } from '@store/hooks';
import { getFullUserName } from '@utils/helpers';
import { useIsDirty } from '@contexts/IsDirtyContext';
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import InputText from '@components/shared/Forms/InputText';
import { selectDataDictionary } from '@store/dataDictionary/selectors';
import { useVariables } from '@hooks/useVariables';

type DecisionTableStepProps = {
  flow: IFlow;
  mainFlow?: IFlow;
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
  isViewMode: boolean;
  mainFlowRfInstance?: CustomReactFlowInstance;
};

const DecisionTable = ({
  step,
  flow,
  mainFlow,
  resetActiveStepId,
  isViewMode,
  mainFlowRfInstance,
  rfInstance: {
    getNodes,
    getEdge,
    getEdges,
    setNodes,
    setEdges,
    onAddNodeBetweenEdges
  }
}: DecisionTableStepProps) => {
  const { isDirty, setIsDirty } = useIsDirty();
  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const user = useAppSelector(selectUserInfo);
  const { allVariables, integrationVariables } = useVariables();
  const { enumDataTypes } = useAppSelector(selectDataDictionary);

  const [caseEntries, setCaseEntries] = useState<CaseEntry[]>([]);

  const {
    handleSubmit,
    control,
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
  const isPreview = isViewMode || !canUpdateFlow;
  const username = getFullUserName(user);
  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  const flatVariables = useMemo(() => _.flatMap(allVariables), [allVariables]);

  const stepIds = caseEntries.map(({ edgeId }) => edgeId);

  const conditionsColumns = getColumns(
    // If we have empty conditions, then we should provide the initial
    // entry to make possible to trigger variable menu.
    // note: actions columns always have step column with this menu
    caseEntries[0]?.conditions?.length
      ? caseEntries[0]?.conditions
      : [INITIAL_ENTRY],
    flatVariables,
    enumDataTypes,
    'conditions'
  );

  const actionsColumns = getColumns(
    caseEntries[0]?.actions || [],
    flatVariables,
    enumDataTypes,
    'actions'
  );

  const stepColumn = {
    name: STEP,
    dataType: VARIABLE_DATA_TYPE.String,
    category: CATEGORIES.Actions,
    index: actionsColumns.length
  };

  const columns = [...conditionsColumns, ...actionsColumns, stepColumn];

  const stepOptions = useMemo(
    () =>
      getConnectableNodes(nodes, step.id).map((node) => ({
        value: node.id,
        label: node.data.name
      })),
    [nodes, step.id]
  );

  const initialData = useMemo(() => {
    const { data } = step;

    // To make possible setup default actions for already existed table
    const defaultActions =
      data.defaultActions?.length === 0
        ? (data.caseEntries?.[0]?.actions || []).map((entry) => ({
            ...INITIAL_ENTRY,
            name: entry.name
          }))
        : data.defaultActions;

    // Compose default actions, and defaultEdgeId here, to manage state the same way as for actions
    const caseEntriesWithDefaultActions = data.caseEntries?.length
      ? [
          ...data.caseEntries,
          {
            conditions: [],
            actions: defaultActions || [],
            edgeId: data.defaultEdgeId || null
          }
        ]
      : [];

    const savedCaseEntries = caseEntriesWithDefaultActions.map((caseEntry) => ({
      ...caseEntry,
      // We manipulate with stepIds so this field will contain the stepId, untill send to backend
      edgeId: getEdge(caseEntry.edgeId || '')?.target || null
    }));

    return {
      savedCaseEntries,
      savedNote: data.note || ''
    };
  }, [step.data]);

  const handleAddNewLayer = () => {
    setCaseEntries((prev) => {
      if (!prev.length) return INITIAL_CASE_ENTRIES;

      const caseEntries = [...prev];

      const addEntries = (category: CATEGORY) =>
        (category === 'conditions' ? conditionsColumns : actionsColumns).map(
          (column) => ({
            ...INITIAL_ENTRY,
            name: column.name,
            dataType: column.dataType
          })
        );

      const newCaseEntry = {
        conditions: addEntries('conditions'),
        actions: addEntries('actions'),
        edgeId: null
      };

      caseEntries.splice(prev.length - 1, 0, newCaseEntry);

      return caseEntries;
    });
  };

  const handleDeleteLayer = (index: number) => {
    setCaseEntries((prev) => {
      // Else condition row always present in the table,
      // the last possible deleted row will be the first one and additionally remove the last one
      if (prev.length === 2) return [];
      return prev.filter((_, prevIndex) => prevIndex !== index);
    });
  };

  const handleAddColumn = ({ category, index }: ColumnData) => {
    setCaseEntries((prev) =>
      updateCaseEntry({
        caseEntries: prev.length ? prev : INITIAL_CASE_ENTRIES,
        category,
        start: index + 1,
        deleteCount: 0,
        insertEntry: INITIAL_ENTRY
      })
    );
  };

  const handleDeleteColumn = ({ category, index }: ColumnData) => {
    setCaseEntries((prev) =>
      updateCaseEntry({
        caseEntries: prev,
        category,
        start: index,
        deleteCount: 1
      })
    );
  };

  const handleChangeColumn = (
    { category, index }: ColumnData,
    newVariable: DataDictionaryVariable
  ) => {
    const insertEntry = {
      ...INITIAL_ENTRY,
      name: newVariable.name,
      dataType: newVariable.dataType,
      sourceName: newVariable.sourceName,
      sourceType: newVariable.sourceType
    };

    setCaseEntries((prev) =>
      updateCaseEntry({
        caseEntries: prev.length ? prev : INITIAL_CASE_ENTRIES,
        category,
        start: index,
        deleteCount: 1,
        insertEntry
      })
    );
  };

  const handleEntryChange = (
    data: FormFieldsProps,
    { category, rowIndex, columnIndex }: SelectedCell
  ) => {
    setCaseEntries((prev) =>
      prev.map((row, currentRowIndex) => {
        if (currentRowIndex !== rowIndex) return row;

        return {
          ...row,
          [category]: row[category]?.map((column, currentColumnIndex) =>
            currentColumnIndex !== columnIndex
              ? column
              : {
                  ...column,
                  expression: data.value,
                  operator: data.operator,
                  isDataDictionaryExpression: data.type === VALUE_TYPES.Variable
                }
          )
        };
      })
    );
  };

  const handleChangeStep = (rowIndex: number, stepId: string) => {
    setCaseEntries((prev) =>
      prev.map((entry, index) =>
        rowIndex === index ? { ...entry, edgeId: stepId } : entry
      )
    );
  };

  const handleConfirm = async ({ note }: FieldValues) => {
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
        const updatedCaseEntries = caseEntries.map(
          ({ actions, conditions }, index) => ({
            conditions,
            edgeId: splitEdges[index]?.target ? splitEdges[index].id : null,
            actions: actions?.map((action) => {
              if (action.destinationType) return action;
              return {
                ...action,
                destinationType: flatVariables.find(
                  ({ name, sourceType }) =>
                    action.name === name && action.sourceType === sourceType
                )?.destinationType
              };
            })
          })
        );

        const lastCaseEntry = updatedCaseEntries.pop();

        const updatedVariableSources = getVariableSources(
          [
            ...(caseEntries[0]?.actions || []),
            ...(caseEntries[0]?.conditions || [])
          ],
          flatVariables
        );

        node.data = {
          ...node.data,
          defaultEdgeId: splitEdges[splitEdges.length - 1]?.target
            ? splitEdges[splitEdges.length - 1].id
            : null,
          caseEntries: updatedCaseEntries,
          editedBy: username,
          editedOn: new Date().toISOString(),
          note,
          defaultActions: lastCaseEntry?.actions ?? [],
          variableSources: updatedVariableSources
        };
      }

      return node;
    });

    try {
      const data = formatFlowDataForValidation(
        mainFlow,
        mainFlowRfInstance,
        flow,
        updatedNodes,
        newEdges
      );

      await flowService.validateFlow(data);

      setNodes(updatedNodes);
      setEdges(newEdges);
      enqueueSnackbar(
        <Message
          message="Success"
          details={`Changes for the "${step.data.name}" step were successfully applied.`}
        />,
        { variant: SNACK_TYPE.SUCCESS }
      );
      resetActiveStepId();
    } catch (error) {
      enqueueSnackbar(<ErrorMessage message="Error" error={error} />, {
        variant: SNACK_TYPE.ERROR
      });
    }
  };

  const checkIsDirty = (caseEntries: CaseEntry[], noteValue: string | null) => {
    const hasChangesInCaseEntries =
      JSON.stringify(initialData.savedCaseEntries) !==
      JSON.stringify(caseEntries);
    const isNoteValueChanged = initialData.savedNote !== noteValue;

    setIsDirty(hasChangesInCaseEntries || isNoteValueChanged);
  };

  const debounceCheckIsDirty = useCallback(_.debounce(checkIsDirty, 300), [
    step.data
  ]);

  useEffect(() => {
    setCaseEntries(initialData.savedCaseEntries);
  }, [initialData]);

  useEffect(() => {
    debounceCheckIsDirty(caseEntries, watchNote);
  }, [caseEntries, watchNote]);

  return (
    <>
      <StepContentWrapper>
        <StepDetailsHeader
          step={step}
          title={`${isPreview ? 'View' : 'Edit'} Step: ${step.data.name}`}
          details={STEP_DETAILS}
        />
        <Paper
          sx={{
            bgcolor: theme.palette.background.default,
            overflow: 'auto',
            boxShadow: customBoxShadows.elevation1
          }}
        >
          <Table
            hasUserPermission={!isPreview}
            stepIds={stepIds}
            columns={columns}
            rows={caseEntries}
            variables={allVariables}
            integrationData={integrationVariables}
            stepOptions={stepOptions}
            handleChangeStep={handleChangeStep}
            handleDeleteRow={handleDeleteLayer}
            handleAddColumn={handleAddColumn}
            handleDeleteColumn={handleDeleteColumn}
            handleChangeColumn={handleChangeColumn}
            handleEntryChange={handleEntryChange}
          />
        </Paper>
        {!isPreview && (
          <Button
            size="small"
            sx={{ width: 'fit-content', mt: 1 }}
            variant="outlined"
            onClick={handleAddNewLayer}
            startIcon={<PlusSquareIcon />}
          >
            Add New Business Layer
          </Button>
        )}
        {caseEntries.length > 0 && (
          <ConditionsCard caseEntries={caseEntries} nodes={nodes} />
        )}
        <form>
          <NoteSection>
            <InputText
              fullWidth
              name="note"
              control={control}
              label="Note"
              placeholder="Enter note here"
              disabled={isPreview}
            />
          </NoteSection>
        </form>
      </StepContentWrapper>
      <StepDetailsControlBar
        disabled={!_.isEmpty(errors) || isSubmitting}
        isEdited={isDirty}
        resetActiveStepId={resetActiveStepId}
        handleConfirm={() => {
          void handleSubmit(handleConfirm)();
        }}
        isShow={!isPreview}
      />
    </>
  );
};

export default DecisionTable;
