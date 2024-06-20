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
import { FlowNode } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader/StepDetailsHeader';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { RULES_LIMIT, SNACK_TYPE } from '@constants/common';
import Dialog from '@components/shared/Modals/Dialog';
import { ExpressionForm } from '@components/ExpressionForm/ExpressionForm.tsx';
import { SnackbarMessage } from '@components/shared/Snackbar/SnackbarMessage';
import { InputText } from '@components/shared/Forms/InputText';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar.tsx';
import StepNoteSection from '@views/DecisionTable/StepNoteSection/StepNoteSection';
import { StepContentWrapper } from '@views/styled';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';
import { useViewMode } from '@hooks/useViewMode';
import { selectUserInfo } from '@store/auth/auth';
import { useAppSelector } from '@store/hooks';
import { getFullUserName } from '@utils/helpers';

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
    Expression & { id: string }
  >();

  const viewMode = useViewMode();
  const hasUserPermission = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isViewMode = viewMode || !hasUserPermission;
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);

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

  const onSubmit = (data: FieldValues) => {
    const updatedNodes = nodes.map((node: FlowNode) => {
      if (node.id === step.id) {
        node.data = {
          ...node.data,
          editedBy: username,
          editedOn: new Date().toISOString(),
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
    <>
      {!openExpEditorView && (
        <>
          <StepContentWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <StepDetailsHeader
                step={step}
                title={`${isViewMode ? 'View' : 'Edit'} Step: ${step.data.name}`}
                details="Calculation is a step that allows the User to set a value for the parameter."
              />
              <Stack>
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
                                {isViewMode && (
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
                                )}
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
                {!isViewMode && (
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
          </StepContentWrapper>
          <StepDetailsControlBar
            disabled={isSubmitting}
            onDiscard={() => setOpenDiscardModal(true)}
            isSubmitting={isSubmitting}
            onApplyChangesClick={() => {
              void handleSubmit(onSubmit)();
            }}
            isShow={!isViewMode}
          />
        </>
      )}
      {openExpEditorView && (
        <ExpressionForm
          renderTitle={() => (
            <StepDetailsHeader
              step={step}
              title={(initialValue?.id ? 'Change' : 'Add New') + ' Expression'}
            />
          )}
          initialValues={initialValue}
          handleAddNewBusinessRule={handleAddNewBussinesRule}
          onCancelClick={() => setOpenExpEditorView(false)}
        />
      )}
    </>
  );
};

export default Calculation;
