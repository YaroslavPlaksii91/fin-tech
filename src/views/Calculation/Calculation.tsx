import { useContext, useEffect, useState } from 'react';
import {
  Button,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography
} from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';

import { Expression, FieldValues, columns } from './types';

import { FlowNode, IFlow } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { MAIN_STEP_ID, SNACK_TYPE } from '@constants/common';
import Dialog from '@components/shared/Modals/Dialog';
import {
  StyledTableRow,
  StyledTableCell,
  StyledPaper,
  StyledTableContainer
} from '@components/shared/Table/styled';
import {
  AddIcon,
  DeleteOutlineIcon,
  EditNoteOutlinedIcon
} from '@components/shared/Icons';
import { ExpressionForm } from '@components/ExpressionForm/ExpressionForm.tsx';
import { SnackbarMessage } from '@components/shared/Snackbar/SnackbarMessage';
import { NoteForm } from '@components/StepManagment/NoteForm/NoteForm';
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { InputText } from '@components/shared/Forms/InputText';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';
interface CalculationProps {
  step: FlowNode;
  setStep: (step: FlowNode | { id: typeof MAIN_STEP_ID }) => void;
  rfInstance: CustomReactFlowInstance;
  flow: IFlow;
}

const Calculation: React.FC<CalculationProps> = ({
  step,
  setStep,
  rfInstance: { getNodes, setNodes }
}) => {
  const nodes: FlowNode[] = getNodes();
  const [openNoteModal, setOpenNoteModal] = useState<boolean>(false);
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [openExpEditorModal, setOpenExpEditorModal] = useState<boolean>(false);
  const [initialValue, setInitialValue] = useState<
    (Expression & { id: number }) | undefined
  >(undefined);
  const value = useContext(DataDictionaryContext);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { isSubmitting }
  } = useForm<FieldValues>({ defaultValues: { expressions: [], note: '' } });

  const { fields, append, remove, update } = useFieldArray({
    name: 'expressions',
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

  const onSubmit = (data: FieldValues) => {
    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        node.data = {
          ...node.data,
          note: data.note,
          expressions: data.expressions
        };
      }
      return node;
    });
    setNodes(updatedNodes);
    enqueueSnackbar(
      <SnackbarMessage
        message="Success"
        details={`Changes for the "${step.data.name}" step were successfully applied.`}
      />,
      { variant: SNACK_TYPE.SUCCESS }
    );
    setStep({ id: MAIN_STEP_ID });
  };

  useEffect(() => {
    setValue('expressions', step.data.expressions || []);
    setValue('note', step.data.note || '');
  }, [step.data]);

  const handleAddNewBussinesRule = ({
    data,
    id
  }: {
    data: Expression;
    id?: number;
  }) => {
    if (id !== undefined) {
      update(id, data);
    } else {
      append(data);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepDetailsHeader
          title={step.data.name}
          details="Calculation is a step that allows the User to set a value for the parameter."
          onDiscard={() => setOpenDiscardModal(true)}
          disabled={isSubmitting}
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
                  {fields.map((expression, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell>
                        {expression.outputVariableName}
                      </StyledTableCell>
                      <StyledTableCell>
                        {expression.expressionString}
                      </StyledTableCell>
                      <StyledTableCell sx={{ padding: 0 }} width={40}>
                        <Stack direction="row">
                          <Button
                            fullWidth
                            sx={{ padding: '10px' }}
                            onClick={() => {
                              setInitialValue({
                                ...expression,
                                id: index
                              });
                              setOpenExpEditorModal(true);
                            }}
                          >
                            <EditNoteOutlinedIcon />
                          </Button>
                          <Button
                            fullWidth
                            sx={{ padding: '10px' }}
                            onClick={() => {
                              remove(index);
                            }}
                          >
                            <DeleteOutlineIcon />
                          </Button>
                        </Stack>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </StyledPaper>
          <Button
            sx={{ width: '190px' }}
            onClick={() => {
              // setInitialValue(undefined);
              setOpenExpEditorModal(true);
            }}
            startIcon={<AddIcon />}
          >
            Add new business rule
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
      <NoteForm
        modalOpen={openNoteModal}
        handleClose={handleCloseNoteModal}
        handleSubmitNote={handleSubmitNote}
        note={getValues('note') ?? ''}
      />
      {value?.variables && (
        <ExpressionForm
          initialValues={initialValue}
          variables={value.variables}
          handleAddNewBusinessRule={handleAddNewBussinesRule}
          modalOpen={openExpEditorModal}
          setModalOpen={setOpenExpEditorModal}
        />
      )}
    </>
  );
};

export default Calculation;
