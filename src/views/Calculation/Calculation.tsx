import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
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

import TrashIcon from '@icons/trash.svg';
import EditIcon from '@icons/editPencil.svg';
import PlusSquareIcon from '@icons/plusSquare.svg';
import { FlowNode, IFlow } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader/StepDetailsHeader';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { RULES_LIMIT, SNACK_TYPE } from '@constants/common';
import Dialog from '@components/shared/Modals/Dialog';
import { ExpressionForm } from '@components/ExpressionForm/ExpressionForm.tsx';
import { SnackbarMessage } from '@components/shared/Snackbar/SnackbarMessage';
import { NoteForm } from '@components/StepManagment/NoteForm/NoteForm';
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { InputText } from '@components/shared/Forms/InputText';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar.tsx';
import { StepContainer } from '@views/styled';

interface CalculationProps {
  flow: IFlow;
  mainFlow?: IFlow;
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
}

const Calculation: React.FC<CalculationProps> = ({
  flow,
  mainFlow,
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
    <StepContainer>
      <Stack sx={{ minHeight: '100%' }} direction="column" spacing={0}>
        {!openExpEditorView && (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <StepDetailsHeader
                  flow={mainFlow ?? flow}
                  step={step}
                  title={`Edit Step: ${step.data.name}`}
                  details="Calculation is a step that allows the User to set a value for the parameter."
                  disabled={isSubmitting}
                  isActionContainerVisible={false}
                />
                <Stack pl={3} pr={3}>
                  <Box mb={1}>
                    <Card variant="outlined">
                      <CardContent
                        sx={{ padding: '0px !important', overflow: 'hidden' }}
                      >
                        <Table
                          size="small"
                          stickyHeader
                          aria-label="sticky table"
                        >
                          <TableHead>
                            <TableRow>
                              {columns.map((column) =>
                                column.id === COLUMN_IDS.delete_edit ? (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ width: column.width }}
                                  >
                                    {column.label}
                                  </TableCell>
                                ) : (
                                  <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ width: column.width }}
                                  >
                                    {column.label}
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {fields.map((expression, index) => (
                              <TableRow key={index}>
                                <TableCell>{expression.outputName}</TableCell>
                                <TableCell>
                                  {expression.expressionString}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    padding: 0
                                  }}
                                  width={40}
                                >
                                  <Stack direction="row">
                                    <IconButton
                                      onClick={() => {
                                        setInitialValue({
                                          ...expression,
                                          id: expression.id
                                        });
                                        setOpenExpEditorView(true);
                                      }}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      onClick={() => {
                                        remove(index);
                                      }}
                                    >
                                      <TrashIcon />
                                    </IconButton>
                                  </Stack>
                                </TableCell>
                              </TableRow>
                            ))}
                            {!fields.length && (
                              <TableRow>
                                <TableCell sx={{ borderBottom: 0 }} colSpan={6}>
                                  <Box py={2}>
                                    <Typography
                                      variant="body2"
                                      textAlign="center"
                                    >
                                      No Expressions Yet.
                                    </Typography>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </Box>
                  <Button
                    disabled={fields.length === RULES_LIMIT}
                    variant="outlined"
                    size="small"
                    sx={{ maxWidth: 180 }}
                    onClick={() => {
                      setInitialValue(undefined);
                      setOpenExpEditorView(true);
                    }}
                    startIcon={<PlusSquareIcon />}
                  >
                    Add New Expression
                  </Button>
                  <Box mt={2}>
                    <Card variant="outlined">
                      <CardContent>
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
                      </CardContent>
                    </Card>
                  </Box>
                </Stack>
              </form>
              <Dialog
                title="Cancel Changes"
                open={openDiscardModal}
                onConfirm={handleDiscardChanges}
                onClose={() => setOpenDiscardModal(false)}
                confirmText="Yes"
                cancelText="No"
              >
                <Typography sx={{ maxWidth: '416px' }} variant="body2">
                  Canceling changes will delete all edits in this step, this
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
              renderTitle={() => (
                <StepDetailsHeader
                  flow={mainFlow ?? flow}
                  step={step}
                  title={`Edit step: ${(initialValue?.id ? 'Change' : 'Add New') + ' Expression'}`}
                  disabled
                  isActionContainerVisible={false}
                />
              )}
              initialValues={initialValue}
              handleAddNewBusinessRule={handleAddNewBussinesRule}
              onCancelClick={() => setOpenExpEditorView(false)}
            />
          </Box>
        )}
      </Stack>
    </StepContainer>
  );
};

export default Calculation;
