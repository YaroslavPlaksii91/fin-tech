import {
  AutocompleteRenderInputParams,
  Button,
  FormControl,
  InputLabel,
  Stack,
  TextField
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { groupBy, omit } from 'lodash';
// import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';

// import validationSchema from './validationSchema';
import { FieldValues, Option } from './types';
import { mapVariablesToParamsAndSources, parseError } from './utils';

import Dialog from '@components/shared/Modals/Dialog';
import LoadingButton from '@components/shared/LoadingButton';
import { Expression } from '@views/Calculation/types';
import AddVariable from '@components/AddVariable/AddVariable';
import ExpressionOperatorsList from '@components/ExpressionForm/ExpressionOperatorsList/ExpressionOperatorsList.tsx';
import {
  // DATA_TYPE_WITHOUT_ENUM,
  DataDictionaryVariable,
  UserDefinedVariable
  // VARIABLE_DESTINATION_TYPE,
  // VARIABLE_SOURCE_TYPE
} from '@domain/dataDictionary';
import ExpressionEditor, {
  ExpressionEditorAPI
} from '@components/ExpressionEditor/ExpressionEditor.tsx';
import {
  functionsConfig,
  functionsLiterals,
  operatorsConfig
} from '@components/ExpressionEditor/ExpressionEditor.constants.ts';
import AutocompleteGroup from '@components/shared/Autocomplete/AutocompleteGroup';
import {
  DATA_DICTIONARY_GROUP,
  DATA_DICTIONARY_LABELS
} from '@constants/common';
import { dataDictionaryService } from '@services/data-dictionary';
import { StyledErrorText } from '@components/shared/ErrorText/styled';

const operatorsList = [
  ...Object.values(groupBy(operatorsConfig, 'category')),
  ...Object.values(groupBy(functionsConfig, 'category'))
];

interface ExpressionFormProps {
  initialValues?: Expression & { id: string };
  variables: Record<string, DataDictionaryVariable[] | UserDefinedVariable[]>;
  handleAddNewBusinessRule: ({
    data,
    id
  }: {
    data: Expression;
    id?: string;
  }) => void;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

export const ExpressionForm: React.FC<ExpressionFormProps> = ({
  initialValues,
  variables,
  handleAddNewBusinessRule,
  modalOpen,
  setModalOpen
}) => {
  const expressionEditorRef: MutableRefObject<ExpressionEditorAPI | null> =
    useRef(null);

  const options = useMemo(() => {
    const readWriteVariables = omit(variables, [
      DATA_DICTIONARY_GROUP.laPMSVariables
    ]);
    return Object.entries(readWriteVariables).reduce(
      (acc: Option[], [group, items]) => {
        const groupOptions = items.map((item) => ({
          group: DATA_DICTIONARY_LABELS[group],
          ...item
        }));
        return [...acc, ...groupOptions];
      },
      []
    );
  }, [variables]);

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      variable: {},
      expressionString: ''
    }
    // resolver: yupResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const allValues = Object.values(variables).flat();
    const usageVariables = allValues.filter((items) => {
      const regex = new RegExp(`\\b${items.name}\\b`);
      return regex.test(data.expressionString);
    });
    const { params, variableSources } =
      mapVariablesToParamsAndSources(usageVariables);
    try {
      await dataDictionaryService.validateExpression({
        expression: data.expressionString,
        targetDataType: data.variable.dataType,
        params
      });
      const formatData = {
        outputName: data.variable.name,
        expressionString: data.expressionString,
        destinationType: data.variable.destinationType,
        destinationDataType: data.variable.dataType,
        variableSources
      };
      handleAddNewBusinessRule({
        data: formatData,
        id: initialValues?.id
      });
      handleCloseModal();
    } catch (error) {
      const dataError = error instanceof AxiosError && parseError(error);
      if (dataError) {
        setError('expressionString', {
          message: dataError.message
        });
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  useEffect(() => {
    const initialData = { variable: null, expressionString: '' };
    if (initialValues) {
      const variable =
        options.find(
          (variable) => variable.name === initialValues.outputName
        ) ?? null;
      const initialData = {
        variable,
        expressionString: initialValues.expressionString
      };
      reset(initialData);
    } else {
      reset(initialData);
    }
  }, [initialValues, modalOpen, options]);

  const onExpressionOperatorsListClick = useCallback(
    (literal: string) => {
      const prev = getValues('expressionString');
      const isFunction = functionsLiterals.includes(literal);
      const newValue = prev + literal + (isFunction ? '(' : '');
      setValue('expressionString', newValue, { shouldValidate: true });
      expressionEditorRef.current?.focus({
        selectionStart: newValue.length + 1
      });
    },
    [setValue, getValues, expressionEditorRef]
  );

  const onVariableListClick = useCallback(
    (variable: DataDictionaryVariable | UserDefinedVariable) => {
      const cursorPosition =
        expressionEditorRef.current?.getCursorPosition() || 0;
      const prev = getValues('expressionString');
      const newValue =
        prev.slice(0, cursorPosition) +
        variable.name +
        prev.slice(cursorPosition);
      setValue('expressionString', newValue, { shouldValidate: true });
      expressionEditorRef.current?.focus({
        selectionStart: newValue.length + 1
      });
    },
    []
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
          <Controller
            control={control}
            name="variable"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <AutocompleteGroup
                forcePopupIcon={false}
                disableClearable={true}
                id="grouped-variables"
                value={value}
                isOptionEqualToValue={(option: Option, value: Option) =>
                  option.name === value.name
                }
                noOptionsText="No variables"
                options={options}
                onChange={(_e, data) => onChange(data)}
                groupBy={(option) => option.group}
                getOptionLabel={(option: Option) => option.name || ''}
                renderInput={(params: AutocompleteRenderInputParams) => (
                  <FormControl fullWidth variant="standard">
                    <InputLabel
                      sx={{ position: 'static' }}
                      shrink
                      htmlFor="variable"
                    >
                      Variable
                    </InputLabel>
                    <TextField
                      {...params}
                      size="small"
                      sx={{ width: 320 }}
                      helperText={error?.message}
                      error={!!error}
                      placeholder="Enter variable"
                    />
                  </FormControl>
                )}
              />
            )}
          />
          <Controller
            control={control}
            name="expressionString"
            render={({ field: { onChange, value }, fieldState }) => (
              <FormControl fullWidth variant="standard">
                <InputLabel
                  sx={{ position: 'static' }}
                  shrink
                  htmlFor="expressionString"
                >
                  Expression
                </InputLabel>
                <ExpressionEditor
                  value={value}
                  onChange={onChange}
                  name="expressionString"
                  ref={expressionEditorRef}
                  error={fieldState?.error?.message}
                />
              </FormControl>
            )}
          />
        </Stack>
        <Stack spacing={2} direction="row" pt={2}>
          <AddVariable onItemClick={onVariableListClick} data={variables} />
          <ExpressionOperatorsList
            list={operatorsList}
            onItemClick={onExpressionOperatorsListClick}
          />
        </Stack>
        <StyledErrorText variant="body2">
          {errors?.root?.serverError.message}
        </StyledErrorText>
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
