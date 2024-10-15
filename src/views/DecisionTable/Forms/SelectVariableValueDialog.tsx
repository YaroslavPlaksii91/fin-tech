import { useEffect, useMemo, useState } from 'react';
import { Button, Stack } from '@mui/material';
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
import Content from './Content';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
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
  const defaultOperator = dataType.isStringArray
    ? OPERATORS.ANY
    : OPERATORS.EQUAL;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
    clearErrors,
    setError
  } = useForm<FormFieldsProps>({
    resolver: yupResolver(validationSchema(dataType, selectedVariable)),
    defaultValues: {
      name: selectedCell.name,
      operator: selectedCell.operator || defaultOperator,
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

  const expressionParts = selectedCell.expression.split('.');

  const activeVar = useMemo(
    () =>
      Object.values(variables)
        .flat()
        .find((variable) => variable.name === expressionParts[0]),
    [variables, expressionParts]
  );

  const activeProperty = useMemo(
    () =>
      expressionParts[1]
        ? Object.values(integrationData)
            .flat()
            .find((variable) => variable.name === expressionParts[1])
        : undefined,
    [integrationData, expressionParts]
  );

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
        <Content
          control={control}
          isOperatorDisabled={!isCondition}
          isValueSelectMultiple={dataType.isWithEnum}
          isValueSelectDisabled={watchOperator === OPERATORS.ANY}
          isValueInputDisabled={
            watchOperator === OPERATORS.ANY || isVariableType
          }
          hasBounds={watchOperator === OPERATORS.BETWEEN}
          hasValueAsSelect={
            (dataType.isWithEnum || dataType.isBoolean) && !isVariableType
          }
          operatorOptions={getOperatorOptions(dataType)}
          valueOptions={getFormattedOptions(
            dataType.isBoolean
              ? BOOLEAN_OPTIONS
              : selectedCell.allowedValues || []
          )}
          valueLabel={!isVariableType ? 'Value*' : 'Variable*'}
        />
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
            activeProperty={activeProperty}
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
