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

import { getConnectableNodes } from './utils';
import validationSchema from './validationSchema';
import { FieldValues, columns } from './types';

import { FlowNode, IFlow } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { AddIcon, DeleteOutlineIcon } from '@components/shared/Icons';
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
import { NoteForm } from '@components/StepManagment/NoteForm/NoteForm';
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { MAIN_STEP_ID, SNACK_TYPE } from '@constants/common';
import {
  SnackbarErrorMessage,
  SnackbarMessage
} from '@components/shared/Snackbar/SnackbarMessage';
import Dialog from '@components/shared/Modals/Dialog';
import { flowService } from '@services/flow-service';

const STEPS_LIMIT = 10;
const DEFAULT_PERCENTAGE_SPLIT = 10;

interface ChampionChallengerProps {
  step: FlowNode;
  setStep: (step: FlowNode | { id: typeof MAIN_STEP_ID }) => void;
  rfInstance: CustomReactFlowInstance;
  flow: IFlow;
}

const ChampionChallenger: React.FC<ChampionChallengerProps> = ({
  step,
  setStep,
  flow,
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

  const nodes: FlowNode[] = getNodes();
  const edges = getEdges();

  const {
    handleSubmit,
    control,
    clearErrors,
    getValues,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: { splits: [], note: '' },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
  });

  const { fields, append, remove } = useFieldArray({
    name: 'splits',
    control
  });

  const handleOpenNoteModal = () => {
    setOpenNoteModal(true);
  };

  const handleSubmitNote = (note: string) => {
    setValue('note', note);
    setOpenNoteModal(false);
  };

  const handleCloseNoteModal = () => {
    setValue('note', getValues('note'));
    setOpenNoteModal(false);
  };

  const handleDiscardChanges = () => setStep({ id: MAIN_STEP_ID });

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

    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        // This updates data inside the node. Since React Flow uses Zustand under the hood, it is necessary to recreate the data.
        const splits = node.data.splits ?? [];
        splits.length = 0;
        splits.push(
          ...splitEdges.map((splitEdge, index) => ({
            edgeId: splitEdge.id,
            percentage: data.splits[index].percentage
          }))
        );
        node.data = {
          ...node.data,
          note: data.note,
          splits: [...splits]
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
      setStep({ id: MAIN_STEP_ID });
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepDetailsHeader
          title={step.data.name}
          details="A Champion Challenger is an step that allows you to split traffic into
   several groups and run experiment."
          onDiscard={() => setOpenDiscardModal(true)}
          disabled={!isEmpty(errors) || isSubmitting}
          isSubmitting={isSubmitting}
        />
        <Stack pl={3} pr={3}>
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
                    <StyledTableRow key={field.id}>
                      <StyledTableCell sx={{ padding: '0 12px' }}>
                        <NumberRangeInput
                          control={control}
                          name={`splits.${index}.percentage`}
                          onChangeCb={() => clearErrors()}
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: 0 }}>
                        <SearchableSelect
                          index={index}
                          control={control}
                          onChangeCb={() => clearErrors()}
                          name={`splits.${index}.value`}
                          options={options}
                          selectedOptions={selectedOptions}
                          setSelectedOptions={setSelectedOptions}
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: 0 }} width={40}>
                        <Button
                          fullWidth
                          sx={{ padding: '10px' }}
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
                          <DeleteOutlineIcon />
                        </Button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </StyledPaper>
          <ErrorMessage errors={errors} name="splits" />
          <Button
            sx={{ width: '135px' }}
            disabled={fields.length === STEPS_LIMIT}
            onClick={() => {
              append({ percentage: DEFAULT_PERCENTAGE_SPLIT, value: '' });
            }}
            startIcon={<AddIcon />}
          >
            Add new split
          </Button>
          <NoteSection handleOpenNoteModal={handleOpenNoteModal}>
            <InputText
              fullWidth
              name="note"
              control={control}
              label="Note"
              disabled
              placeholder="Enter note here"
            />
          </NoteSection>
        </Stack>
      </form>
      <NoteForm
        modalOpen={openNoteModal}
        handleClose={handleCloseNoteModal}
        handleSubmitNote={handleSubmitNote}
        note={getValues('note') ?? ''}
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
