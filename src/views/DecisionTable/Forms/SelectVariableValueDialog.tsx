import { useContext, useEffect } from 'react';
import { Button, Stack, InputAdornment, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { SelectedCell, FormFieldsProps, OPERATORS } from '../types';
import {
  getOperatorOptions,
  getFormattedOptions,
  getFormatedValue
} from '../utils';

import validationSchema from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import InputText from '@components/shared/Forms/InputText';
import Select from '@components/shared/Forms/Select';
import { BOOLEAN_OPTIONS } from '@constants/common';
import { flowService } from '@services/flow-service';
import { parseExpressionError } from '@utils/helpers';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext';
import { checkDataType } from '@components/DataDictionaryVariables/utils';

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
  const dataDictionary = useContext(DataDictionaryContext);

  const bounds =
    selectedCell.operator === OPERATORS.BETWEEN
      ? selectedCell.expression.split('and')
      : [];

  const dataType = checkDataType(
    selectedCell.dataType,
    dataDictionary?.enumsDataTypes || []
  );

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
    clearErrors,
    setError
  } = useForm({
    resolver: yupResolver(validationSchema(dataType)),
    defaultValues: {
      name: selectedCell.name,
      operator: selectedCell.operator || OPERATORS.EQUAL,
      value: dataType.isWithEnum
        ? selectedCell.expression
          ? selectedCell.expression.replace(/[[\]\s]/g, '').split(',')
          : []
        : selectedCell.expression,
      lowerBound: bounds.length > 0 ? bounds[0].trim() : undefined,
      upperBound: bounds.length > 0 ? bounds[1].trim() : undefined
    }
  });

  const watchOperator = watch('operator');

  const onSubmit = async (data: FormFieldsProps) => {
    const value = getFormatedValue(data);

    try {
      if (data.operator !== OPERATORS.ANY) {
        if (isCondition) {
          await flowService.validateCondition({
            condition: {
              name: selectedCell.name,
              operator: data.operator,
              expression: value
            },
            params: [
              { name: selectedCell.name, dataType: selectedCell.dataType }
            ]
          });
        } else {
          await flowService.validateExpression({
            expression: value,
            targetDataType: selectedCell.dataType,
            params: []
          });
        }
      }

      handleSubmitForm({ ...data, value, dataType: selectedCell.dataType });
    } catch (error) {
      const dataError = parseExpressionError(error);
      setError('value', {
        message: dataError?.message
      });
    }
  };

  useEffect(() => {
    if (watchOperator === OPERATORS.ANY)
      setValue('value', dataType.isWithEnum ? [] : '');

    clearErrors();
  }, [watchOperator]);

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
            options={getOperatorOptions(dataType)}
          />
          {dataType.isWithEnum || dataType.isBoolean ? (
            <Select
              name="value"
              multiple={dataType.isWithEnum}
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
                name="lowerBound"
                control={control}
                label="Lowest Value*"
              />
              <InputText
                fullWidth
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
              disabled={watchOperator === OPERATORS.ANY}
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
