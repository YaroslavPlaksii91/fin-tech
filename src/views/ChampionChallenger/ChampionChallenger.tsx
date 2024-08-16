import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography
} from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { yupResolver } from '@hookform/resolvers/yup';
import isEmpty from 'lodash/isEmpty';
import { enqueueSnackbar } from 'notistack';

import { formatFlowDataForValidation, getConnectableNodes } from './utils';
import validationSchema from './validationSchema';
import { FieldValues, columns } from './types';

import TrashIcon from '@icons/trash.svg';
import AddIcon from '@icons/plusSquare.svg';
import { FlowNode, IFlow } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader/StepDetailsHeader';
import NumberRangeInput from '@components/shared/NumberRangeInput/NumberRangeInput';
import SearchableSelect from '@components/shared/SearchableSelect/SearchableSelect';
import {
  ADD_BUTTON_ON_EDGE,
  CustomReactFlowInstance
} from '@components/FlowManagment/FlowChart/types';
import ErrorMessage from '@components/shared/ErrorText/ErrorText';
import { InputText } from '@components/shared/Forms/InputText';
import {
  StyledPaper,
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow
} from '@components/shared/Table/styled';
import { RULES_LIMIT, SNACK_TYPE } from '@constants/common';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import { flowService } from '@services/flow-service';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar';
import { theme } from '@theme';
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { StepContentWrapper } from '@views/styled';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';
import { useAppSelector } from '@store/hooks';
import { selectUserInfo } from '@store/auth/auth';
import { getFullUserName } from '@utils/helpers';
import { useIsDirty } from '@contexts/IsDirtyContext';

const DEFAULT_PERCENTAGE_SPLIT = 10;

interface ChampionChallengerProps {
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
  flow: IFlow;
  mainFlow?: IFlow;
  isViewMode: boolean;
}

const ChampionChallenger: React.FC<ChampionChallengerProps> = ({
  step,
  resetActiveStepId,
  flow,
  mainFlow,
  isViewMode,
  rfInstance: {
    getEdge,
    getNodes,
    getEdges,
    setNodes,
    setEdges,
    onAddNodeBetweenEdges
  }
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const { setIsDirty } = useIsDirty();

  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isPreview = isViewMode || !canUpdateFlow;
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);

  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { errors, isSubmitting, dirtyFields },
    setValue,
    watch
  } = useForm<FieldValues, unknown, FieldValues>({
    mode: 'onChange',
    defaultValues: { splits: step.data.splits, note: step.data.note ?? '' },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
  });

  const { fields, append, remove } = useFieldArray({
    name: 'splits',
    control
  });

  const watchNote = watch('note');

  const isEdited = useMemo(
    () =>
      Object.keys(dirtyFields).length !== 0 ||
      watchNote !== (step.data.note ?? ''),
    [dirtyFields, watchNote, step.data.note]
  );

  const onSubmit = async (data: FieldValues) => {
    const existingSplitEdges =
      step.data.splits?.map(({ edgeId }) => edgeId) ?? [];

    const targetNodesIds = data.splits.map((spl) => spl.value);

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

    const newEdges = edges
      .filter((edg) => !existingSplitEdges.includes(edg.id))
      .filter((edg) => !targetNodesIds.includes(edg.target))
      .concat(splitEdges);

    const newSplits = splitEdges.map((splitEdge, index) => ({
      edgeId: splitEdge.id,
      percentage: data.splits[index].percentage
    }));

    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        node.data = {
          ...node.data,
          editedBy: username,
          editedOn: new Date().toISOString(),
          note: data.note,
          splits: [...newSplits]
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
    if (step.data.splits) {
      const defaultSelectedOptions: string[] = [];
      const defaultNote = step.data.note || '';
      const defaultSplits = step.data.splits.map((split) => {
        const edgeId = split.edgeId || '';
        const connectedEdges = getEdge(edgeId);
        const connectedNode = connectedEdges?.target || '';
        defaultSelectedOptions.push(connectedNode);
        return {
          percentage: split.percentage,
          value: connectedNode
        };
      });
      setValue('splits', defaultSplits);
      setValue('note', defaultNote);
      setSelectedOptions(defaultSelectedOptions);
      clearErrors();
    }
  }, [step]);

  useEffect(() => {
    const connectableNodes = getConnectableNodes(nodes, step.id);
    const formattedOptions = connectableNodes.map((node) => ({
      value: node.id,
      label: node.data.name
    }));
    setOptions(formattedOptions);
  }, [nodes.length, edges.length, step.id]);

  useEffect(() => {
    setInitialData();
  }, [step.data]);

  useEffect(() => {
    setIsDirty(isEdited);
  }, [isEdited]);

  return (
    <>
      <StepContentWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StepDetailsHeader
            step={step}
            title={`${isPreview ? 'View' : 'Edit'} Step: ${step.data.name}`}
            details="A Champion Challenger is a step that allows you to split traffic into several groups and run experiment."
          />
          <Stack>
            <StyledPaper>
              <StyledTableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <StyledTableRow>
                      {columns.map((column) => (
                        <StyledTableCell
                          key={column.id}
                          align={column.align}
                          style={{ width: column.width }}
                        >
                          {column.label}
                        </StyledTableCell>
                      ))}
                    </StyledTableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <StyledTableRow
                        key={field.id}
                        parity={(index + 1) % 2 === 0 ? 'even' : 'odd'}
                      >
                        <StyledTableCell>
                          <NumberRangeInput
                            control={control}
                            name={`splits.${index}.percentage`}
                            onChangeCb={() => clearErrors()}
                            disabled={isPreview}
                          />
                        </StyledTableCell>
                        <StyledTableCell>
                          <SearchableSelect
                            index={index}
                            control={control}
                            onChangeCb={() => clearErrors()}
                            name={`splits.${index}.value`}
                            options={options}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            disabled={isPreview}
                          />
                        </StyledTableCell>
                        <StyledTableCell width={40}>
                          {!isPreview && (
                            <Button
                              fullWidth
                              sx={{ p: 0 }}
                              onClick={() => {
                                clearErrors();
                                const removedOption = fields[index].value;
                                setSelectedOptions(
                                  selectedOptions.filter(
                                    (option) => option !== removedOption
                                  )
                                );
                                remove(index);
                              }}
                            >
                              <TrashIcon color={theme.palette.error.main} />
                            </Button>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                    {!fields.length ? (
                      <StyledTableRow parity="odd">
                        <StyledTableCell colSpan={3} align="center">
                          <Typography variant="body2">No Split Yet.</Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </StyledPaper>
            <ErrorMessage errors={errors} name="splits" />
            {!isPreview && (
              <Button
                sx={{ width: '135px' }}
                disabled={fields.length === RULES_LIMIT}
                variant="outlined"
                size="small"
                onClick={() => {
                  append({ percentage: DEFAULT_PERCENTAGE_SPLIT, value: '' });
                }}
                startIcon={<AddIcon />}
              >
                Add new split
              </Button>
            )}
          </Stack>
          {!isPreview && (
            <NoteSection>
              <InputText
                fullWidth
                name="note"
                control={control}
                label="Note"
                placeholder="Enter note here"
              />
            </NoteSection>
          )}
        </form>
      </StepContentWrapper>
      <StepDetailsControlBar
        disabled={!isEmpty(errors) || isSubmitting}
        resetActiveStepId={resetActiveStepId}
        isEdited={isEdited}
        isSubmitting={isSubmitting}
        onApplyChangesClick={() => {
          void handleSubmit(onSubmit)();
        }}
        isShow={!isPreview}
      />
    </>
  );
};

export default ChampionChallenger;
