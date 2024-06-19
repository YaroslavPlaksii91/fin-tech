import { useState, useEffect, useCallback } from 'react';
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
import { cloneDeep } from 'lodash';

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
import Dialog from '@components/shared/Modals/Dialog';
import { flowService } from '@services/flow-service';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar';
import { theme } from '@theme';
import StepNoteSection from '@views/DecisionTable/StepNoteSection/StepNoteSection';
import { StepContentWrapper } from '@views/styled';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';
import { useViewMode } from '@hooks/useViewMode';

const DEFAULT_PERCENTAGE_SPLIT = 10;

interface ChampionChallengerProps {
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
  flow: IFlow;
  mainFlow?: IFlow;
}

const ChampionChallenger: React.FC<ChampionChallengerProps> = ({
  step,
  resetActiveStepId,
  flow,
  mainFlow,
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

  const [openNoteModal, setOpenNoteModal] = useState<boolean>(false);
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  const viewMode = useViewMode();
  const hasUserPermission = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isViewMode = viewMode || !hasUserPermission;

  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  const {
    handleSubmit,
    control,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<FieldValues, unknown, FieldValues>({
    mode: 'onChange',
    defaultValues: { splits: [], note: '' },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
  });

  const { fields, append, remove } = useFieldArray({
    name: 'splits',
    control
  });

  const handleOpenNoteModal = () => setOpenNoteModal(true);

  const handleSubmitNote = (note: string) => {
    setValue('note', note);
    setOpenNoteModal(false);
  };

  const handleCloseNoteModal = () => {
    setValue('note', getValues('note'));
    setOpenNoteModal(false);
  };

  const handleDiscardChanges = () => resetActiveStepId();

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

    const storedNodes = cloneDeep(nodes);
    const storedEdges = cloneDeep(edges);

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
      setNodes(storedNodes);
      setEdges(storedEdges);
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

  return (
    <>
      <StepContentWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StepDetailsHeader
            step={step}
            title={`${isViewMode ? 'View' : 'Edit'} Step: ${step.data.name}`}
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
                        <StyledTableCell sx={{ p: '0 12px' }}>
                          <NumberRangeInput
                            control={control}
                            name={`splits.${index}.percentage`}
                            onChangeCb={() => clearErrors()}
                            disabled={isViewMode}
                          />
                        </StyledTableCell>
                        <StyledTableCell sx={{ p: 0 }}>
                          <SearchableSelect
                            index={index}
                            control={control}
                            onChangeCb={() => clearErrors()}
                            name={`splits.${index}.value`}
                            options={options}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            disabled={isViewMode}
                          />
                        </StyledTableCell>
                        <StyledTableCell sx={{ p: 0 }} width={40}>
                          {!isViewMode && (
                            <Button
                              fullWidth
                              sx={{ p: '10px' }}
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
            {!isViewMode && (
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
        </form>
        {!isViewMode && (
          <StepNoteSection
            modalOpen={openNoteModal}
            handleCloseModal={handleCloseNoteModal}
            handleOpenModal={handleOpenNoteModal}
            noteValue={getValues('note') ?? ''}
            handleSubmitNote={handleSubmitNote}
            renderInput={() => (
              <InputText
                fullWidth
                name="note"
                control={control}
                label="Note"
                disabled
                placeholder="Enter note here"
              />
            )}
          />
        )}
      </StepContentWrapper>
      <StepDetailsControlBar
        disabled={!isEmpty(errors) || isSubmitting}
        onDiscard={() => setOpenDiscardModal(true)}
        isSubmitting={isSubmitting}
        onApplyChangesClick={() => {
          void handleSubmit(onSubmit)();
        }}
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

export default ChampionChallenger;
