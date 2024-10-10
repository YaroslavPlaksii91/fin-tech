import { useEffect, useState } from 'react';
import { Button, Stack, InputAdornment, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  SelectedCell,
  FormFieldsProps,
  OPERATORS,
  VALUE_TYPES
} from '../types';
import {
  getOperatorOptions,
  getFormattedOptions,
  getFormatedValue,
  filterVariablesByUsageMode
} from '../utils';

import validationSchema from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import InputText from '@components/shared/Forms/InputText';
import Select from '@components/shared/Forms/Select';
import { BOOLEAN_OPTIONS } from '@constants/common';
import { flowService } from '@services/flow-service';
import { parseExpressionError } from '@utils/helpers';
import { checkDataType } from '@components/DataDictionaryVariables/utils';
import DataDictionaryDialog from '@components/DataDictionaryVariables/DataDictionaryDialog/DataDictionaryDialog';
import { Variable } from '@domain/dataDictionary';
import { useAppSelector } from '@store/hooks';
import { selectDataDictionary } from '@store/dataDictionary/selectors';

type SelectVariableValueDialogProps = {
  modalOpen: boolean;
  isCondition: boolean;
  selectedCell: SelectedCell;
  handleClose: () => void;
  handleSubmitForm: (data: FormFieldsProps) => void;
  variables: Record<string, Variable[]>;
  integrationData: Record<string, Variable[]>;
};

const SelectVariableValueDialog = ({
  modalOpen,
  isCondition,
  selectedCell,
  handleClose,
  handleSubmitForm,
  variables,
  integrationData
}: SelectVariableValueDialogProps) => {
  const [selectedVariable, setSelectedVariable] = useState<Variable | null>(
    null
  );
  const { enumDataTypes } = useAppSelector(selectDataDictionary);

  const bounds =
    selectedCell.operator === OPERATORS.BETWEEN
      ? selectedCell.expression.split('and')
      : [];

  const dataType = checkDataType(selectedCell.dataType, enumDataTypes);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
    clearErrors,
    setError
  } = useForm({
    resolver: yupResolver(validationSchema(dataType, selectedVariable)),
    defaultValues: {
      name: selectedCell.name,
      operator: selectedCell.operator || OPERATORS.EQUAL,
      type: VALUE_TYPES.Value,
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
  const watchType = watch('type');
  const isVariableType = watchType === VALUE_TYPES.Variable;
  const defaultVariableValue = 'Select Variable lower';

  const activeVar = Object.values(variables)
    .flat()
    .find((variable) => variable.name === selectedCell.expression);

  const onSubmit = async (data: FormFieldsProps) => {
    const formattedValue = getFormatedValue(data);
    const value = selectedVariable ? selectedVariable.name : formattedValue;

    const params = [
      { name: selectedCell.name, dataType: selectedCell.dataType }
    ];

    if (selectedVariable) {
      params.push({
        name: selectedVariable.name,
        dataType: selectedVariable.dataType
      });
    }

    try {
      if (data.operator !== OPERATORS.ANY) {
        if (isCondition) {
          await flowService.validateCondition({
            condition: {
              name: selectedCell.name,
              operator: data.operator,
              expression: value
            },
            params
          });
        } else {
          await flowService.validateExpression({
            expression: value,
            targetDataType: selectedCell.dataType,
            params: selectedVariable
              ? [
                  {
                    name: selectedVariable.name,
                    dataType: selectedVariable.dataType
                  }
                ]
              : []
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

  const handleSelectVariable = (variable: Variable | null) => {
    setValue(
      'value',
      dataType.isWithEnum
        ? [variable?.name || defaultVariableValue]
        : variable?.name || defaultVariableValue
    );
    setSelectedVariable(variable);
  };

  useEffect(() => {
    if (watchOperator === OPERATORS.ANY)
      setValue('value', dataType.isWithEnum ? [] : '');

    clearErrors();
  }, [watchOperator]);

  useEffect(() => {
    if (activeVar) {
      setValue('type', VALUE_TYPES.Variable);
    }
  }, []);

  useEffect(() => {
    if (watchType === VALUE_TYPES.Variable) {
      if (!activeVar) {
        setValue(
          'value',
          dataType.isWithEnum ? [defaultVariableValue] : defaultVariableValue
        );
      } else {
        setValue(
          'value',
          dataType.isWithEnum
            ? [selectedCell.expression]
            : selectedCell.expression
        );
      }
    } else {
      if (activeVar) {
        setValue('value', dataType.isWithEnum ? [] : '');
      } else {
        setValue(
          'value',
          dataType.isWithEnum
            ? selectedCell.expression
              ? selectedCell.expression.replace(/[[\]\s]/g, '').split(',')
              : []
            : selectedCell.expression
        );
      }
      setSelectedVariable(null);
    }
    clearErrors();
  }, [watchType]);

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
          sx={{ mb: '20px' }}
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
          <Select
            name="type"
            control={control}
            sx={{
              width: '280px',
              minWidth: '158px'
            }}
            label="Type*"
            options={getFormattedOptions(Object.values(VALUE_TYPES))}
          />
          {(dataType.isWithEnum || dataType.isBoolean) && !isVariableType ? (
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
              label={!isVariableType ? 'Value*' : 'Variable*'}
              disabled={watchOperator === OPERATORS.ANY || isVariableType}
            />
          )}
        </Stack>
        {isVariableType && (
          <DataDictionaryDialog
            title="Select Variable"
            data={filterVariablesByUsageMode(variables, selectedCell.category)}
            integrationData={
              selectedCell.category === 'actions' ? undefined : integrationData
            }
            setSelectedObjectPropertyFunction={(object, property) => ({
              ...property,
              sourceName: object.name,
              sourceType: object.sourceType
            })}
            mode="withoutModal"
            handleSelectVariable={handleSelectVariable}
            activeVar={activeVar}
          />
        )}
        <Stack pt={1} spacing={1} direction="row" justifyContent="flex-end">
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting || (isVariableType && !selectedVariable)}
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
