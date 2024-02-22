import { Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { groupBy } from 'lodash';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
import LoadingButton from '@components/shared/LoadingButton';
import { Expression } from '@views/Calculation/types';
import AddVariable from '@components/AddVariable/AddVariable';
import ExpressionOperatorsList from '@components/ExpressionForm/ExpressionOperatorsList/ExpressionOperatorsList.tsx';
import {
  DATA_TYPE_WITHOUT_ENUM,
  VARIABLE_DESTINATION_TYPE,
  VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';
import ExpressionEditor from '@components/ExpressionEditor/ExpressionEditor.tsx';
import {
  functionsConfig,
  operatorsConfig
} from '@components/ExpressionEditor/ExpressionEditor.constants.ts';

const DEFAULT_MOCK = {
  outputVariableName: 'temp2',
  expressionString: 'Max(perm2,3,1) == 4',
  destinationType: VARIABLE_DESTINATION_TYPE.TemporaryVariable,
  destinationDataType: DATA_TYPE_WITHOUT_ENUM.Boolean,
  inputVariables: [
    {
      variableName: 'perm2',
      sourceType: VARIABLE_SOURCE_TYPE.PermanentVariable
    }
  ]
};

const operatorsList = [
  ...Object.values(groupBy(operatorsConfig, 'category')),
  ...Object.values(groupBy(functionsConfig, 'category'))
];

interface ExpressionFormProps {
  initialValues?: Expression & { id: number };
  handleAddNewBussinesRule: ({
    data,
    id
  }: {
    data: Expression;
    id?: number;
  }) => void;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export const ExpressionForm: React.FC<ExpressionFormProps> = ({
  initialValues,
  handleAddNewBussinesRule,
  modalOpen,
  setModalOpen
}) => {
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    formState: { isSubmitting }
  } = useForm<Expression>({
    defaultValues: {
      outputVariableName: '',
      expressionString: ''
    }
  });

  const onSubmit: SubmitHandler<Expression> = (data) => {
    handleAddNewBussinesRule({ data, id: initialValues?.id });
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

  const onExpressionOperatorsListClick = useCallback(
    (literal: string) => {
      const prev = getValues('expressionString');
      setValue('expressionString', prev + literal);
    },
    [setValue, getValues]
  );

  return (
    <Dialog
      title="Add new business rule"
      fullWidth
      maxWidth="md"
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
            minRows={1}
            disabled
            name="expressionString"
            control={control}
            label="Expression"
            placeholder="Enter expression"
            InputProps={{
              inputComponent: ExpressionEditor
            }}
          />
        </Stack>
        <Stack spacing={2} direction="row" pt={2}>
          <AddVariable />
          <ExpressionOperatorsList
            list={operatorsList}
            onItemClick={onExpressionOperatorsListClick}
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
