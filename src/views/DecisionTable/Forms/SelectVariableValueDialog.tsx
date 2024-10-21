import { useEffect, useMemo } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
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
import { Variable, VARIABLE_DATA_TYPE } from '@domain/dataDictionary';
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
    resolver: yupResolver(validationSchema(dataType)),
    defaultValues: {
      name: selectedCell.name,
      operator: selectedCell.operator || defaultOperator,
      type: selectedCell.isDataDictionaryExpression
        ? VALUE_TYPES.Variable
        : VALUE_TYPES.Value,
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
  const value = watch('value');
  const isVariableType = watchType === VALUE_TYPES.Variable;

  const activeVariable = useMemo(
    () =>
      Object.values(variables)
        .flat()
        .find((variable) =>
          typeof value === 'string'
            ? variable.name === value?.split(/\.(.+)/)[0]
            : false
        ),
    [variables, value]
  );

  const activeProperty = useMemo(
    () =>
      Object.values(integrationData)
        .flat()
        .find((variable) =>
          typeof value === 'string'
            ? variable.name === value?.split(/\.(.+)/)[1]
            : false
        ),
    [integrationData, value]
  );

  const onSubmit = async (
    data: FormFieldsProps,
    selectedVariable?: Variable
  ) => {
    if (data.operator === OPERATORS.ANY) {
      handleSubmitForm({ ...data, dataType: selectedCell.dataType });
      return;
    }

    const value = selectedVariable
      ? selectedVariable.name
      : getFormatedValue(data);

    const params = [
      { name: selectedCell.name, dataType: selectedCell.dataType }
    ];

    const expressionVariableParam = {
      name: selectedVariable?.name || '',
      dataType: selectedVariable?.dataType || VARIABLE_DATA_TYPE.String
    };

    if (selectedVariable) {
      params.push(expressionVariableParam);
    }

    try {
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
          params: selectedVariable ? [expressionVariableParam] : []
        });
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
    setValue('value', variable?.name);
    clearErrors();
  };

  const DialogContent = () => (
    <Content
      control={control}
      isOperatorDisabled={!isCondition}
      isValueSelectMultiple={dataType.isWithEnum}
      isValueSelectDisabled={watchOperator === OPERATORS.ANY}
      isTypeSelectDisabled={
        watchOperator === OPERATORS.ANY || watchOperator === OPERATORS.BETWEEN
      }
      isValueInputDisabled={watchOperator === OPERATORS.ANY || isVariableType}
      hasBounds={watchOperator === OPERATORS.BETWEEN}
      hasValueAsSelect={
        (dataType.isWithEnum || dataType.isBoolean) && !isVariableType
      }
      operatorOptions={getOperatorOptions(dataType)}
      valueOptions={getFormattedOptions(
        dataType.isBoolean ? BOOLEAN_OPTIONS : selectedCell.allowedValues || []
      )}
      valueLabel={!isVariableType ? 'Value*' : 'Variable*'}
    />
  );

  useEffect(() => {
    if (watchOperator === OPERATORS.ANY) {
      setValue('type', VALUE_TYPES.Value);
      setValue('value', dataType.isWithEnum ? [] : '');
    }
    if (watchOperator === OPERATORS.BETWEEN) {
      setValue('type', VALUE_TYPES.Value);
    }

    clearErrors();
  }, [watchOperator]);

  return isVariableType ? (
    <DataDictionaryDialog
      title="Select Variable"
      isOpen={modalOpen}
      onClose={handleClose}
      data={filterVariablesByUsageMode(variables, selectedCell.category)}
      integrationData={
        selectedCell.category === 'actions' ? undefined : integrationData
      }
      setSelectedObjectPropertyFunction={(object, property) => ({
        ...property,
        sourceName: object.name,
        sourceType: object.sourceType
      })}
      onSelect={handleSelectVariable}
      activeVariable={activeVariable}
      activeProperty={activeProperty}
      onConfirm={async (selectedVariable) => {
        await handleSubmit((data) => onSubmit(data, selectedVariable))();
      }}
      maxWidth="lg"
    >
      <Box p="16px 24px 0">
        <Typography variant="h6" color="text.primary" mb={2}>
          {isCondition ? 'Enter condition' : 'Enter output'}
        </Typography>
        <DialogContent />
      </Box>
    </DataDictionaryDialog>
  ) : (
    <Dialog
      title={isCondition ? 'Enter condition' : 'Enter output'}
      open={modalOpen}
      displayConfirmBtn={false}
      displayedCancelBtn={false}
      fullWidth={true}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <DialogContent />
        <Stack pt={1} spacing={1} direction="row" justifyContent="flex-end">
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
