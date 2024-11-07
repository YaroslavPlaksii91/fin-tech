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
import { yupResolver } from '@hookform/resolvers/yup';
import * as _ from 'lodash-es';

import { COLUMN_IDS, Expression, FieldValues, columns } from './types';
import validationSchema from './validationSchema';

import TrashIcon from '@icons/trash.svg';
import EditIcon from '@icons/editPencil.svg';
import PlusSquareIcon from '@icons/plusSquare.svg';
import { FlowNode } from '@domain/flow';
import StepDetailsHeader from '@components/StepManagment/StepDetailsHeader/StepDetailsHeader';
import { CustomReactFlowInstance } from '@components/FlowManagment/FlowChart/types';
import { RULES_LIMIT, SNACK_TYPE } from '@constants/common';
import { ExpressionForm } from '@components/ExpressionForm/ExpressionForm';
import Message from '@components/shared/Snackbar/Message';
import InputText from '@components/shared/Forms/InputText';
import StepDetailsControlBar from '@components/StepManagment/StepDetailsControlBar/StepDetailsControlBar';
import NoteSection from '@components/StepManagment/NoteSection/NoteSection';
import { StepContentWrapper } from '@views/styled';
import { useHasUserPermission } from '@hooks/useHasUserPermission';
import { permissionsMap } from '@constants/permissions';
import { selectUserInfo } from '@store/auth';
import { useAppSelector } from '@store/hooks';
import { getFullUserName } from '@utils/helpers';
import { customBoxShadows, theme } from '@theme';
import { useIsDirty } from '@contexts/IsDirtyContext';
import { StyledTableRow } from '@components/shared/Table/styled';
import { preventIdleTimeout } from '@utils/preventIdleTimeout';

interface CalculationProps {
  step: FlowNode;
  resetActiveStepId: () => void;
  rfInstance: CustomReactFlowInstance;
  isViewMode: boolean;
}

const Calculation: React.FC<CalculationProps> = ({
  step,
  resetActiveStepId,
  rfInstance: { getNodes, setNodes },
  isViewMode
}) => {
  const nodes: FlowNode[] = getNodes();
  const [openExpEditorView, setOpenExpEditorView] = useState(false);
  const [initialValue, setInitialValue] = useState<
    Expression & { id: string }
  >();

  const { isDirty, setIsDirty } = useIsDirty();
  const canUpdateFlow = useHasUserPermission(permissionsMap.canUpdateFlow);
  const isPreview = isViewMode || !canUpdateFlow;
  const user = useAppSelector(selectUserInfo);
  const username = getFullUserName(user);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields }
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: {
      expressions: step.data.expressions,
      note: step.data.note ?? ''
    },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
  });
  const watchNote = watch('note');

  const { fields, append, remove, update } = useFieldArray({
    name: 'expressions',
    control
  });

  const onSubmit = async (data: FieldValues) => {
    await preventIdleTimeout();
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
      <Message
        message="Success"
        details={`Changes for the "${step.data.name}" step were successfully applied.`}
      />,
      { variant: SNACK_TYPE.SUCCESS }
    );
    resetActiveStepId();
  };

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

  useEffect(() => {
    setValue('expressions', step.data.expressions || []);
    setValue('note', step.data.note || '');
  }, [step.data]);

  useEffect(
    () =>
      setIsDirty(
        Object.keys(dirtyFields).length !== 0 ||
          watchNote !== (step.data.note ?? '')
      ),
    [dirtyFields, watchNote, step.data.note]
  );

  return (
    <>
      {!openExpEditorView && (
        <>
          <StepContentWrapper>
            <form onSubmit={handleSubmit(onSubmit)}>
              <StepDetailsHeader
                step={step}
                title={`${isPreview ? 'View' : 'Edit'} Step: ${step.data.name}`}
                details="Calculation is a step that allows the User to set a value for the parameter."
              />
              <Stack>
                <Box mb={1}>
                  <Card
                    variant="outlined"
                    sx={{ boxShadow: customBoxShadows.elevation1 }}
                  >
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
                            <StyledTableRow
                              key={index}
                              parity={index % 2 === 0 ? 'even' : 'odd'}
                            >
                              <TableCell>{expression.outputName}</TableCell>
                              <TableCell>
                                {expression.expressionString}
                              </TableCell>
                              <TableCell width={40}>
                                {!isPreview && (
                                  <Stack direction="row" gap={1}>
                                    <IconButton
                                      sx={{ padding: '0' }}
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
                                      sx={{ padding: '0' }}
                                      onClick={() => {
                                        remove(index);
                                      }}
                                    >
                                      <TrashIcon
                                        color={theme.palette.error.main}
                                      />
                                    </IconButton>
                                  </Stack>
                                )}
                              </TableCell>
                            </StyledTableRow>
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
                {!isPreview && (
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
            isSubmitting={isSubmitting}
            handleConfirm={() => {
              void handleSubmit(onSubmit)();
            }}
            isShow={!isPreview}
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
