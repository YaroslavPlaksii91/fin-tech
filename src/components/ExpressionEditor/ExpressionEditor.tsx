import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect } from 'react';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';
import {
  DataType,
  Expression,
  VariableDestinationType,
  VariableSourceType
} from '@views/Calculation/types';

const DEFAULT_MOCK = {
  outputVariableName: 'temp2',
  expressionString: '"Max(perm2,3,1) == 4"',
  destinationType: VariableDestinationType.temporaryVariable,
  destinationDataType: DataType.boolean,
  inputVariables: [
    {
      variableName: 'perm2',
      sourceType: VariableSourceType.permanentVariable
    }
  ]
};

interface ExpressionEditorProps {
  initialValues?: Expression;
  handleAddNewBussinesRule: (data: Expression) => void;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  initialValues,
  handleAddNewBussinesRule,
  modalOpen,
  setModalOpen
}) => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting }
  } = useForm<Expression>({
    defaultValues: {
      outputVariableName: '',
      expressionString: ''
    }
  });

  const onSubmit: SubmitHandler<Expression> = (data) => {
    handleAddNewBussinesRule(data);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset(DEFAULT_MOCK);
    }
  }, [initialValues]);

  return (
    <Dialog
      title="Add new business rule"
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={1}>
          <InputText
            fullWidth
            name="outputVariableName"
            control={control}
            label="Variable"
            placeholder="Enter variable"
          />
          <InputText
            fullWidth
            name="expressionString"
            control={control}
            label="Expression"
            placeholder="Enter expression"
          />
        </Stack>
        <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="contained"
            color="primary"
            type="submit"
          >
            Confirm
          </LoadingButton>
        </Stack>
      </form>
    </Dialog>
  );
};
