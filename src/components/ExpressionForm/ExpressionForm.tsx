import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { groupBy } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import pick from 'lodash/pick';

import validationSchema from './validationSchema';
import { FieldValues } from './types';
import { mapVariablesToParamsAndSources, parseError } from './utils';

import LoadingButton from '@components/shared/LoadingButton';
import { Expression } from '@views/Calculation/types';
import ExpressionOperatorsList from '@components/ExpressionForm/ExpressionOperatorsList/ExpressionOperatorsList.tsx';
import {
  DataDictionaryVariable,
  UserDefinedVariable
} from '@domain/dataDictionary';
import ExpressionEditor, {
  ExpressionEditorAPI
} from '@components/ExpressionEditor/ExpressionEditor.tsx';
import {
  functionsConfig,
  functionsLiterals,
  operatorsConfig
} from '@components/ExpressionEditor/ExpressionEditor.constants.ts';
import { dataDictionaryService } from '@services/data-dictionary';
import { DataDictionaryContext } from '@contexts/DataDictionaryContext.tsx';
import DataDictionaryDialog from '@components/DataDictionaryVariables/DataDictionaryDialog/DataDictionaryDialog.tsx';
import { DATA_DICTIONARY_GROUP } from '@constants/common.ts';

const operatorsList = [
  ...Object.values(groupBy(operatorsConfig, 'category')),
  ...Object.values(groupBy(functionsConfig, 'category'))
];

interface ExpressionFormProps {
  initialValues?: Expression & { id: string };
  handleAddNewBusinessRule: ({
    data,
    id
  }: {
    data: Expression;
    id?: string;
  }) => void;
  onCancelClick: () => void;
}

enum DataDictMode {
  Variable = 'variable',
  Expression = 'expression'
}

export const ExpressionForm: React.FC<ExpressionFormProps> = ({
  initialValues,
  handleAddNewBusinessRule,
  onCancelClick
}) => {
  const dataDictionary = useContext(DataDictionaryContext);
  const variables = dataDictionary?.variables || {};
  const [dataDictMode, setDataDictMode] = useState<DataDictMode | null>(null);

  const expressionEditorRef: MutableRefObject<ExpressionEditorAPI | null> =
    useRef(null);

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    setError,
    formState: { isSubmitting }
  } = useForm<FieldValues, unknown, FieldValues>({
    mode: 'onChange',
    defaultValues: {
      variable: undefined,
      expressionString: ''
    },
    // @ts-expect-error This @ts-expect-error directive is necessary because of a compatibility issue between the resolver type and the validationSchema type.
    resolver: yupResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const arrayOfVariables = Object.values(variables).flat();
    const usageVariables = arrayOfVariables.filter((items) => {
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
    } catch (error) {
      const dataError = error instanceof AxiosError && parseError(error);
      if (dataError) {
        setError('expressionString', {
          message: dataError.message
        });
      }
    }
  };

  const variableFieldDataDict = useMemo(
    () =>
      pick(variables, [
        DATA_DICTIONARY_GROUP.userDefined,
        DATA_DICTIONARY_GROUP.outputVariables
      ]),
    [variables]
  );

  useEffect(() => {
    const initialData = { variable: undefined, expressionString: '' };
    if (initialValues) {
      const variable = Object.values(variables)
        .flat()
        .find((o) => o.name === initialValues.outputName);

      const initialData = {
        variable,
        expressionString: initialValues.expressionString
      };

      reset(initialData);
    } else {
      reset(initialData);
    }
  }, [initialValues, variables]);

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

      setTimeout(() => {
        expressionEditorRef.current?.focus({
          selectionStart: cursorPosition + variable.name.length
        });
      });
    },
    []
  );

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexGrow: 1 }}>
      <form
        style={{ minHeight: '100%', display: 'flex' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack flexDirection="column">
          <Stack flexGrow={1} pl={3} pr={3} pt={2}>
            <Typography mb={2} variant="h2">
              {initialValues?.id ? 'Change' : 'Add New'} Expression
            </Typography>
            <Box flexGrow={1}>
              <Card sx={{ overflow: 'unset' }}>
                <CardHeader title="Expression Builder" />
                <CardContent sx={{ paddingTop: 0 }}>
                  <Box mb={1}>
                    <Controller
                      control={control}
                      name="variable"
                      render={({ field: { value }, fieldState: { error } }) => (
                        <FormControl fullWidth variant="standard">
                          <OutlinedInput
                            size="small"
                            error={!!error}
                            placeholder="Variable"
                            value={value?.name}
                            readOnly
                            endAdornment={
                              <InputAdornment position="end">
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => {
                                    setDataDictMode(DataDictMode.Variable);
                                  }}
                                >
                                  {value?.name ? 'Change' : 'Add'} Output
                                  Variable
                                </Button>
                              </InputAdornment>
                            }
                          />
                          {error?.message && (
                            <FormHelperText error>
                              {error.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Box>
                  <Controller
                    control={control}
                    name="expressionString"
                    render={({ field: { onChange, value }, fieldState }) => (
                      <FormControl fullWidth variant="standard">
                        <ExpressionEditor
                          value={value}
                          onChange={onChange}
                          name="expressionString"
                          ref={expressionEditorRef}
                          error={fieldState?.error?.message}
                          onAddVariableClick={() => {
                            setDataDictMode(DataDictMode.Expression);
                          }}
                        />
                      </FormControl>
                    )}
                  />
                  <ExpressionOperatorsList
                    list={operatorsList}
                    onItemClick={onExpressionOperatorsListClick}
                  />
                </CardContent>
              </Card>
            </Box>
          </Stack>
          <DataDictionaryDialog
            data={
              dataDictMode === DataDictMode.Variable
                ? variableFieldDataDict
                : dataDictionary?.variables
            }
            isOpen={Boolean(dataDictMode)}
            onClose={() => setDataDictMode(null)}
            onConfirm={(variable) => {
              if (dataDictMode === DataDictMode.Variable) {
                setValue('variable', variable);
              }
              if (dataDictMode === DataDictMode.Expression) {
                onVariableListClick(variable);
              }
            }}
          />
          <Box>
            <Divider />
            <Box px={3} py={2}>
              <Stack
                flexDirection="row"
                justifyContent="end"
                alignItems="flex-start"
                gap={1}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={onCancelClick}
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
            </Box>
            <Divider />
          </Box>
        </Stack>
      </form>
    </Box>
  );
};
