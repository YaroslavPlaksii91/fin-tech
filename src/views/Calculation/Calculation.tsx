import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import TableCell from '@mui/material/TableCell';

import { COLUMN_IDS, Expression, FieldValues, columns } from './types';
import { PinnedTableCell } from './styled';

import { FlowNode } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { RULES_LIMIT, SNACK_TYPE } from '@constants/common';
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
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar.tsx';

interface CalculationProps {
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
}

const Calculation: React.FC<CalculationProps> = ({
  step,
  resetActiveStepId,
  rfInstance: { getNodes, setNodes }
}) => {
  const nodes: FlowNode[] = getNodes();
  const [openNoteModal, setOpenNoteModal] = useState<boolean>(false);
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [openExpEditorView, setOpenExpEditorView] = useState<boolean>(false);
  const [initialValue, setInitialValue] = useState<
    (Expression & { id: string }) | undefined
  >(undefined);

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

  const handleDiscardChanges = () => resetActiveStepId();

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
    resetActiveStepId();
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
    id?: string;
  }) => {
    if (id !== undefined) {
      const index = fields.map((x) => x.id).indexOf(id);
      update(index, data);
    } else {
      append(data);
    }
    setOpenExpEditorView(false);
  };

  return (
    <Stack sx={{ minHeight: '100%' }} direction="column" spacing={0}>
      {!openExpEditorView && (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <StepDetailsHeader
                title={step.data.name}
                details="Calculation is a step that allows the User to set a value for the parameter."
                disabled={isSubmitting}
                isActionContainerVisible={false}
              />
              <Stack pl={3} pr={3}>
                <StyledPaper>
                  <StyledTableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <StyledTableRow>
                          {columns.map((column) =>
                            column.id === COLUMN_IDS.delete_edit ? (
                              <PinnedTableCell
                                key={column.id}
                                align={column.align}
                                style={{ width: column.width }}
                              >
                                {column.label}
                              </PinnedTableCell>
                            ) : (
                              <StyledTableCell
                                key={column.id}
                                align={column.align}
                                style={{ width: column.width }}
                              >
                                {column.label}
                              </StyledTableCell>
                            )
                          )}
                        </StyledTableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((expression, index) => (
                          <StyledTableRow key={index}>
                            <StyledTableCell>
                              {expression.outputName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {expression.expressionString}
                            </StyledTableCell>
                            <PinnedTableCell
                              sx={{
                                padding: 0
                              }}
                              width={40}
                            >
                              <Stack direction="row">
                                <Button
                                  fullWidth
                                  sx={{ padding: '10px' }}
                                  onClick={() => {
                                    setInitialValue({
                                      ...expression,
                                      id: expression.id
                                    });
                                    setOpenExpEditorView(true);
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
                            </PinnedTableCell>
                          </StyledTableRow>
                        ))}
                        {!fields.length && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Typography variant="body2" textAlign="center">
                                No Expressions Yet.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </StyledTableContainer>
                </StyledPaper>
                <Button
                  sx={{ width: '190px' }}
                  disabled={fields.length === RULES_LIMIT}
                  onClick={() => {
                    setInitialValue(undefined);
                    setOpenExpEditorView(true);
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
                Discarding changes will delete all edits in this step, this
                action cannot be canceled. Are you sure you want to cancel the
                changes?
              </Typography>
            </Dialog>
            <NoteForm
              modalOpen={openNoteModal}
              handleClose={handleCloseNoteModal}
              handleSubmitNote={handleSubmitNote}
              note={getValues('note') ?? ''}
            />
          </Box>
          <StepDetailsControlBar
            disabled={isSubmitting}
            onDiscard={() => setOpenDiscardModal(true)}
            isSubmitting={isSubmitting}
            onApplyChangesClick={() => {
              void handleSubmit(onSubmit)();
            }}
          />
        </>
      )}
      {openExpEditorView && (
        <Box
          sx={{
            minHeight: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <ExpressionForm
            initialValues={initialValue}
            handleAddNewBusinessRule={handleAddNewBussinesRule}
            onCancelClick={() => setOpenExpEditorView(false)}
          />
        </Box>
      )}
    </Stack>
  );
};

export default Calculation;
