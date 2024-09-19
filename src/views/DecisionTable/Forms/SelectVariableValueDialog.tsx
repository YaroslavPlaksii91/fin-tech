import { useEffect } from 'react';
import { Button, Stack, InputAdornment, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SelectedCell, FormFieldsProps, OPERATORS } from '../types';
import {
  checkDataType,
  getOperatorOptions,
  getFormattedOptions
} from '../utils';

import validationSchema from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import InputText from '@components/shared/Forms/InputText';
import Select from '@components/shared/Forms/Select';
import { BOOLEAN_OPTIONS } from '@constants/common';
import { flowService } from '@services/flow-service';
import { parseExpressionError } from '@utils/helpers';

type SelectVariableValueDialogProps = {
  modalOpen: boolean;
  isCondition: boolean;
  selectedCell: SelectedCell;
  handleClose: () => void;
  handleSubmitForm: (data: FormFieldsProps) => void;
};

const SelectVariableValueDialog = ({
  modalOpen,
  isCondition,
  selectedCell,
  handleClose,
  handleSubmitForm
}: SelectVariableValueDialogProps) => {
  const bounds =
    selectedCell.operator === OPERATORS.BETWEEN
      ? selectedCell.expression.split('and')
      : [];

  const dataType = checkDataType(selectedCell.dataType);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
    clearErrors,
    setError
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      dataType: selectedCell.dataType,
      name: selectedCell.name,
      operator: selectedCell.operator || OPERATORS.EQUAL,
      value: selectedCell.expression,
      lowerBound: bounds.length > 0 ? +bounds[0] : undefined,
      upperBound: bounds.length > 0 ? +bounds[1] : undefined
    }
  });

  const watchOperator = watch('operator');

  const onSubmit = async (data: FormFieldsProps) => {
    let value = '';

    switch (data.operator) {
      case OPERATORS.BETWEEN:
        value = `${data.lowerBound} and ${data.upperBound}`;
        break;
      case OPERATORS.ANY:
        value = '';
        break;
      default:
        value = data.value || '';
    }

    try {
      if (isCondition) {
        await flowService.validateCondition({
          condition: {
            name: selectedCell.name,
            operator: data.operator,
            expression: value
          },
          params: [{ name: selectedCell.name, dataType: selectedCell.dataType }]
        });
      } else {
        await flowService.validateExpression({
          expression: value,
          targetDataType: selectedCell.dataType,
          params: []
        });
      }

      handleSubmitForm({ ...data, value });
    } catch (error) {
      const dataError = parseExpressionError(error);
      setError('value', {
        message: dataError?.message
      });
    }
  };

  useEffect(() => {
    clearErrors();
  }, [watchOperator]);

  useEffect(() => {
    if (watchOperator === OPERATORS.ANY) {
      setValue('value', '');
      return;
    }

    if (dataType.isObject) setValue('value', 'null');
  }, [watchOperator, dataType.isObject]);

  return (
    <Dialog
      title={isCondition ? 'Enter condition' : 'Enter output'}
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
      fullWidth={true}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 2 }}
        >
          <InputText
            fullWidth
            disabled
            label="Variable*"
            name="name"
            control={control}
            InputProps={{
              startAdornment: isCondition && (
                <InputAdornment position="start">
                  <Typography variant="body1" sx={{ padding: '0 8x 0 0' }}>
                    IF
                  </Typography>
                </InputAdornment>
              )
            }}
          />
          <Select
            name="operator"
            control={control}
            disabled={!isCondition}
            sx={{
              width: '280px',
              minWidth: '140px'
            }}
            label="Operator*"
            options={getOperatorOptions(selectedCell.dataType)}
          />
          {dataType.isWithEnum || dataType.isBoolean ? (
            <Select
              name="value"
              control={control}
              fullWidth
              label="Value*"
              disabled={watchOperator === OPERATORS.ANY}
              options={getFormattedOptions(
                dataType.isBoolean
                  ? BOOLEAN_OPTIONS
                  : selectedCell.allowedValues || []
              )}
            />
          ) : watchOperator === OPERATORS.BETWEEN ? (
            <>
              <InputText
                fullWidth
                type="number"
                name="lowerBound"
                control={control}
                label="Lowest Value*"
              />
              <InputText
                fullWidth
                type="number"
                name="upperBound"
                control={control}
                label="Highest Value*"
              />
            </>
          ) : (
            <InputText
              fullWidth
              name="value"
              control={control}
              label="Value*"
              disabled={watchOperator === OPERATORS.ANY || dataType.isObject}
            />
          )}
        </Stack>
        <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="text"
            color="primary"
            type="submit"
          >
            Confirm
          </LoadingButton>
          <Button variant="text" onClick={handleClose}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};

export default SelectVariableValueDialog;
