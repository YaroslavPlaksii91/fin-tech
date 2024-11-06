import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';
import { unwrapResult } from '@reduxjs/toolkit';

import { STRING_ARRAY_HINT } from '../constants';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/Buttons/Loading';
import InputText from '@components/shared/Forms/InputText';
import { Textarea } from '@components/shared/Forms/Textarea';
import Select from '@components/shared/Forms/Select';
import {
  VARIABLE_SOURCE_TYPE,
  VARIABLE_DATA_TYPE,
  UserDefinedVariable,
  Variable
} from '@domain/dataDictionary';
import { JSONPatchOperation } from '@domain/entity';
import Logger from '@utils/logger';
import { modifyFirstLetter } from '@utils/text';
import CalendarIcon from '@icons/calendar.svg';
import { BOOLEAN_OPTIONS, DATE_FORMAT } from '@constants/common';
import { parseErrorMessages } from '@utils/helpers';
import { useAppDispatch } from '@store/hooks';
import { updateFlow } from '@store/flow/asyncThunk';

type VariableFormProps = {
  flowId: string;
  isOpen: boolean;
  formData?: Variable & {
    index: number;
    variableIsUsed: boolean;
    sourceType: VARIABLE_SOURCE_TYPE;
  };
  onClose: () => void;
};

const VARIABLE_SOURCE_TYPE_OPTIONS = [
  {
    key: VARIABLE_SOURCE_TYPE.TemporaryVariable,
    value: VARIABLE_SOURCE_TYPE.TemporaryVariable
  },
  {
    key: VARIABLE_SOURCE_TYPE.PermanentVariable,
    value: VARIABLE_SOURCE_TYPE.PermanentVariable
  }
];

const ALL_DATA_TYPES = Object.keys(VARIABLE_DATA_TYPE) as Array<
  keyof typeof VARIABLE_DATA_TYPE
>;

const DATA_TYPES_OF_PERMANENT_VARIABLE = ALL_DATA_TYPES.filter(
  (type) =>
    ![
      VARIABLE_DATA_TYPE['Object:CraClarity'],
      VARIABLE_DATA_TYPE['Object:CraFactorTrust']
    ].includes(type as VARIABLE_DATA_TYPE)
);

export const VariableForm: React.FC<VariableFormProps> = ({
  flowId,
  isOpen,
  onClose,
  formData
}) => {
  const dispatch = useAppDispatch();

  const [dataTypeOptions, setDataTypeOptions] = useState(ALL_DATA_TYPES);

  const {
    handleSubmit,
    control,
    watch,
    resetField,
    setError,
    formState: { isSubmitting, errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: formData ? formData.name : '',
      sourceType: formData
        ? formData.sourceType
        : VARIABLE_SOURCE_TYPE_OPTIONS[0].value,
      dataType: formData ? formData.dataType : VARIABLE_DATA_TYPE.String,
      defaultValue: formData ? formData.defaultValue : '',
      description: formData ? formData.description : ''
    }
  });

  const onSubmit = async (
    data: Pick<
      UserDefinedVariable,
      'name' | 'dataType' | 'defaultValue' | 'description' | 'sourceType'
    >
  ) => {
    const formattedData = {
      ...data,
      defaultValue:
        data.dataType === VARIABLE_DATA_TYPE.DateTime && data.defaultValue
          ? new Date(data.defaultValue).toISOString()
          : data.dataType === VARIABLE_DATA_TYPE.String && data.defaultValue
            ? data.defaultValue.replace(/^"|"$/g, '')
            : data.defaultValue
    };
    const operations: JSONPatchOperation[] = [
      {
        value: formattedData,
        path: formData
          ? `/${modifyFirstLetter(formData.sourceType)}s/${formData.index}`
          : `/${modifyFirstLetter(data.sourceType)}s/-`,
        op: formData ? 'replace' : 'add'
      }
    ];

    try {
      unwrapResult(await dispatch(updateFlow({ operations, id: flowId })));
      onClose();
    } catch (error) {
      const dataErrors = parseErrorMessages(error);
      if (dataErrors) {
        setError('name', {
          message: dataErrors[0]
        });
      }
      Logger.error('Error updating temporary variables in the flow:', error);
    }
  };

  const watchDataType = watch('dataType');
  const watchSourceType = watch('sourceType');

  useEffect(() => {
    const initialDefaultValue =
      watchDataType === VARIABLE_DATA_TYPE.Boolean ? 'true' : '';
    resetField('defaultValue', { defaultValue: initialDefaultValue });
  }, [watchDataType, resetField]);

  useEffect(() => {
    if (watchSourceType === VARIABLE_SOURCE_TYPE.PermanentVariable) {
      setDataTypeOptions(DATA_TYPES_OF_PERMANENT_VARIABLE);
    } else {
      setDataTypeOptions(ALL_DATA_TYPES);
    }
    resetField('dataType');
  }, [watchSourceType]);

  return (
    <Dialog
      fullWidth
      title={formData ? 'Edit variable' : 'Create variable'}
      open={isOpen}
      maxWidth="sm"
      displayConfirmBtn={false}
      displayedCancelBtn={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <InputText
            fullWidth
            name="name"
            label="Variable Name"
            control={control}
            disabled={formData && formData.variableIsUsed}
          />
          <Select
            fullWidth
            variant="outlined"
            name="sourceType"
            label="Source Type"
            control={control}
            options={VARIABLE_SOURCE_TYPE_OPTIONS.map((option) => ({
              value: option.value,
              label: option.value
            }))}
            disabled={Boolean(formData)}
          />
          <Select
            fullWidth
            variant="outlined"
            name="dataType"
            label="Data Type"
            control={control}
            options={dataTypeOptions.map((option) => ({
              value: option,
              label: option
            }))}
            disabled={formData && formData.variableIsUsed}
          />
          {(watchDataType === VARIABLE_DATA_TYPE.Decimal ||
            watchDataType === VARIABLE_DATA_TYPE.Integer ||
            watchDataType === VARIABLE_DATA_TYPE.String) && (
            <InputText
              fullWidth
              name="defaultValue"
              label="Default Value"
              control={control}
            />
          )}
          {watchDataType === VARIABLE_DATA_TYPE.StringArray && (
            <InputText
              fullWidth
              name="defaultValue"
              label="Default Value"
              control={control}
              hint={STRING_ARRAY_HINT}
            />
          )}
          {watchDataType === VARIABLE_DATA_TYPE.Boolean && (
            <Select
              fullWidth
              variant="outlined"
              name="defaultValue"
              control={control}
              options={BOOLEAN_OPTIONS.map((option) => ({
                value: option,
                label: option
              }))}
            />
          )}
          {watchDataType === VARIABLE_DATA_TYPE.DateTime && (
            <Controller
              control={control}
              name="defaultValue"
              render={({ field: { value, onChange, ref } }) => (
                <DatePicker
                  sx={{ width: '100%' }}
                  label="Default Value"
                  name="defaultValue"
                  format={DATE_FORMAT}
                  value={value ? dayjs(value) : null}
                  onChange={onChange}
                  inputRef={ref}
                  slots={{ openPickerIcon: CalendarIcon }}
                  slotProps={{
                    textField: {
                      size: 'small',
                      error: !!errors.defaultValue,
                      helperText: errors.defaultValue?.message
                    },
                    openPickerIcon: { color: 'black' },
                    actionBar: { actions: ['cancel', 'accept'] }
                  }}
                />
              )}
            />
          )}
          <Textarea
            fullWidth
            name="description"
            label="Description"
            control={control}
            minRows={4}
          />
        </Stack>
        <Stack mt={3} spacing={1} direction="row" justifyContent="flex-end">
          <LoadingButton
            loading={isSubmitting}
            disabled={isSubmitting}
            variant="text"
            type="submit"
          >
            Save Changes
          </LoadingButton>
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};
