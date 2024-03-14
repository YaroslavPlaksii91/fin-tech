import { AutocompleteRenderInputParams, Button, Stack } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  MutableRefObject,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { groupBy } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';

import validationSchema from './validationSchema';
import { Option } from './types';
import { mapVariablesToParamsAndSources } from './utils';

import Dialog from '@components/shared/Modals/Dialog';
import { InputText } from '@components/shared/Forms/InputText';
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
import { DATA_DICTIONARY_LABELS } from '@constants/common';
import { dataDictionaryService } from '@services/data-dictionary';
import { parseErrorMessages } from '@utils/helpers';
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
  const [autoCompleteValue, setAutoCompleteValue] = useState<Option | null>(
    null
  );

  const options = useMemo(
    () =>
      Object.entries(variables).reduce((acc: Option[], [group, items]) => {
        const groupOptions = items.map((item) => ({
          group: DATA_DICTIONARY_LABELS[group],
          ...item
        }));
        return [...acc, ...groupOptions];
      }, []),
    [variables]
  );

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<Expression>({
    mode: 'onChange',
    defaultValues: {
      outputName: '',
      expressionString: ''
    },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<Expression> = async (data) => {
    const usageVariables = options.filter((option) => {
      const regex = new RegExp(`\\b${option.name}\\b`);
      return regex.test(data.expressionString);
    });
    const { params, variableSources } =
      mapVariablesToParamsAndSources(usageVariables);
    try {
      await dataDictionaryService.validateExpression({
        expression: data.expressionString,
        targetDataType: data.destinationDataType,
        params
      });
      handleAddNewBusinessRule({
        data: { ...data, variableSources },
        id: initialValues?.id
      });
      handleCloseModal();
    } catch (err) {
      const message = parseErrorMessages(err);
      setError('expressionString', {
        message
      });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
      const defaultValue =
        options.find((variable) => variable.name === getValues('outputName')) ??
        null;
      setAutoCompleteValue(defaultValue);
    } else {
      setAutoCompleteValue(null);
      reset(undefined);
    }
  }, [initialValues, modalOpen, options]);

  const onExpressionOperatorsListClick = useCallback(
    (literal: string) => {
      const prev = getValues('expressionString');
      const isFunction = functionsLiterals.includes(literal);
      const newValue = prev + literal + (isFunction ? '(' : '');
      setValue('expressionString', newValue);
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
      setValue('expressionString', newValue);
      expressionEditorRef.current?.focus({
        selectionStart: newValue.length + 1
      });
    },
    []
  );

  const handleAutoCompleteChange = (
    _event: SyntheticEvent<Element, Event>,
    value: Option | null
  ) => {
    if (value) {
      setValue('outputName', value.name);
      setValue('destinationType', value.destinationType);
      setValue('destinationDataType', value.dataType);
    }
    setAutoCompleteValue(value);
  };

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
          <AutocompleteGroup
            forcePopupIcon={false}
            disableClearable={true}
            id="grouped-variables"
            value={autoCompleteValue}
            isOptionEqualToValue={(option: Option, value: Option) =>
              option.name === value.name
            }
            noOptionsText="No variables"
            options={options}
            onChange={handleAutoCompleteChange}
            groupBy={(option) => option.group}
            getOptionLabel={(option: Option) => option.name || ''}
            renderInput={(params: AutocompleteRenderInputParams) => (
              <InputText
                {...params}
                size="small"
                sx={{ width: 320 }}
                name="outputName"
                control={control}
                label="Variable"
                placeholder="Enter variable"
              />
            )}
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
              inputComponent: (props) => (
                <ExpressionEditor
                  {...props}
                  ref={expressionEditorRef}
                  error={!!errors?.expressionString}
                />
              )
            }}
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
