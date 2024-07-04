import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux/es/hooks/useDispatch';
import { DatePicker } from '@mui/x-date-pickers-pro';
import dayjs from 'dayjs';

import { validationSchema } from './validationSchema';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { InputText } from '@components/shared/Forms/InputText';
import { Textarea } from '@components/shared/Forms/Textarea';
import { SingleSelect } from '@components/shared/Forms/SingleSelect';
import {
  VARIABLE_SOURCE_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  UserDefinedVariable,
  Variable
} from '@domain/dataDictionary';
import { JSONPatchOperation } from '@domain/entity';
import { flowService } from '@services/flow-service';
import Logger from '@utils/logger';
import { modifyFirstLetter } from '@utils/text';
import { updateFlow } from '@store/flow/flow';
import CalendarIcon from '@icons/calendar.svg';
import { DATE_FORMAT } from '@constants/common';
import { parseErrorMessages } from '@utils/helpers';

type VariableFormProps = {
  flowId: string;
  isOpen: boolean;
  formData?: Variable & { index: number; variableIsUsed: boolean };
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

const ALL_DATA_TYPES = Object.keys(DATA_TYPE_WITHOUT_ENUM) as Array<
  keyof typeof DATA_TYPE_WITHOUT_ENUM
>;

const DATA_TYPES_OF_PERMANENT_VARIABLE = ALL_DATA_TYPES.filter(
  (type) =>
    ![
      DATA_TYPE_WITHOUT_ENUM['Object:CraClarity'],
      DATA_TYPE_WITHOUT_ENUM['Object:CraFactorTrust']
    ].includes(type as DATA_TYPE_WITHOUT_ENUM)
);

export const VariableForm: React.FC<VariableFormProps> = ({
  flowId,
  isOpen,
  onClose,
  formData
}) => {
  const dispatch = useDispatch();
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
      sourceType: VARIABLE_SOURCE_TYPE_OPTIONS[0].value,
      dataType: formData ? formData.dataType : DATA_TYPE_WITHOUT_ENUM.String,
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
        data.dataType === DATA_TYPE_WITHOUT_ENUM.DateTime && data.defaultValue
          ? new Date(data.defaultValue).toISOString()
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
      const newFlowData =
        flowId && (await flowService.updateFlow(flowId, operations));

      newFlowData && dispatch(updateFlow(newFlowData));
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
      watchDataType === DATA_TYPE_WITHOUT_ENUM.Boolean ? 'true' : '';
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
          <SingleSelect
            variant="outlined"
            name="sourceType"
            label="Source Type"
            control={control}
            displayEmpty
            fullWidth
            disabled={Boolean(formData)}
            sx={{
              '& .MuiInputBase-root ': {
                height: '40px'
              }
            }}
          >
            {VARIABLE_SOURCE_TYPE_OPTIONS.map((sourceType) => (
              <MenuItem key={sourceType.key} value={sourceType.value}>
                {sourceType.value}
              </MenuItem>
            ))}
          </SingleSelect>
          <SingleSelect
            variant="outlined"
            name="dataType"
            label="Data Type"
            control={control}
            disabled={formData && formData.variableIsUsed}
            displayEmpty
            fullWidth
            sx={{
              '& .MuiInputBase-root ': {
                height: '40px'
              }
            }}
          >
            {dataTypeOptions.map((dataType, index) => (
              <MenuItem key={index} value={dataType}>
                {dataType}
              </MenuItem>
            ))}
          </SingleSelect>
          {(watchDataType === DATA_TYPE_WITHOUT_ENUM.Decimal ||
            watchDataType === DATA_TYPE_WITHOUT_ENUM.Integer) && (
            <InputText
              fullWidth
              type="number"
              name="defaultValue"
              label="Default Value"
              control={control}
            />
          )}
          {watchDataType === DATA_TYPE_WITHOUT_ENUM.String && (
            <InputText
              fullWidth
              name="defaultValue"
              label="Default Value"
              control={control}
            />
          )}
          {watchDataType === DATA_TYPE_WITHOUT_ENUM.Boolean && (
            <SingleSelect
              variant="outlined"
              name="defaultValue"
              displayEmpty
              control={control}
              fullWidth
              sx={{
                '& .MuiInputBase-root ': {
                  height: '40px'
                }
              }}
            >
              <MenuItem selected value="false">
                false
              </MenuItem>
              <MenuItem value="true">true</MenuItem>
            </SingleSelect>
          )}
          {watchDataType === DATA_TYPE_WITHOUT_ENUM.DateTime && (
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
