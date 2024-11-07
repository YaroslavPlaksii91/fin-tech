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
  Paper,
  Stack
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import React, {
  MutableRefObject,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import * as _ from 'lodash-es';
import { yupResolver } from '@hookform/resolvers/yup';

import validationSchema from './validationSchema';
import { FieldValues } from './types';
import { mapVariablesToParamsAndSources } from './utils';

import LoadingButton from '@components/shared/Buttons/Loading';
import { Expression } from '@views/Calculation/types';
import ExpressionOperatorsList from '@components/ExpressionForm/ExpressionOperatorsList/ExpressionOperatorsList';
import {
  DATA_DICTIONARY_GROUP,
  DataDictionaryVariable
} from '@domain/dataDictionary';
import ExpressionEditor, {
  ExpressionEditorAPI
} from '@components/ExpressionEditor';
import {
  functionsConfig,
  functionsLiterals,
  operatorsConfig
} from '@components/ExpressionEditor/constants';
import VariablesDialog from '@components/shared/VariablesDialog';
import { StepContentWrapper } from '@views/styled';
import { customBoxShadows } from '@theme';
import { flowService } from '@services/flow-service';
import { parseExpressionError } from '@utils/helpers';
import { useVariables } from '@hooks/useVariables';

const operatorsList = [
  ...Object.values(_.groupBy(operatorsConfig, 'category')),
  ...Object.values(_.groupBy(functionsConfig, 'category'))
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
  renderTitle?: () => ReactElement;
}

enum DataDictMode {
  Variable = 'variable',
  Expression = 'expression'
}

export const ExpressionForm: React.FC<ExpressionFormProps> = ({
  initialValues,
  handleAddNewBusinessRule,
  onCancelClick,
  renderTitle
}) => {
  const { allVariables, integrationVariables } = useVariables();

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
    const arrayOfVariables = Object.values(allVariables).flat();
    const usageVariables = arrayOfVariables.filter((items) => {
      const regex = new RegExp(`\\b${items.name}\\b`);
      return regex.test(data.expressionString);
    });

    const { params, variableSources } =
      mapVariablesToParamsAndSources(usageVariables);

    try {
      await flowService.validateExpression({
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
      const dataError = parseExpressionError(error);
      if (dataError) {
        setError('expressionString', {
          message: dataError.message
        });
      }
    }
  };

  const variableFieldDataDict = useMemo(
    () =>
      _.pick(allVariables, [
        DATA_DICTIONARY_GROUP.userDefined,
        DATA_DICTIONARY_GROUP.outputVariables
      ]),
    [allVariables]
  );

  useEffect(() => {
    const initialData = { variable: undefined, expressionString: '' };
    if (initialValues) {
      const variable = Object.values(allVariables)
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
  }, [initialValues, allVariables]);

  const onExpressionOperatorsListClick = useCallback(
    (literal: string) => {
      const prev = getValues('expressionString');
      const isFunction = functionsLiterals.includes(literal);
      const newValue = prev + literal + (isFunction ? '(' : ' ');
      setValue('expressionString', newValue, { shouldValidate: true });

      expressionEditorRef.current?.focus({
        selectionStart: newValue.length + 1
      });
    },
    [setValue, getValues, expressionEditorRef]
  );

  const onVariableListClick = useCallback(
    (variable: DataDictionaryVariable) => {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <StepContentWrapper>
        {renderTitle && renderTitle()}
        <Box>
          <Card
            variant="outlined"
            sx={{ overflow: 'unset', boxShadow: customBoxShadows.elevation1 }}
          >
            <CardHeader
              sx={{ padding: '8px 16px' }}
              title="Expression Builder"
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent
              sx={{
                paddingTop: 0,
                ':last-child': { paddingBottom: '8px' }
              }}
            >
              <Box mb={1}>
                <Controller
                  control={control}
                  name="variable"
                  render={({ field: { value }, fieldState: { error } }) => (
                    <FormControl fullWidth variant="standard">
                      <OutlinedInput
                        size="small"
                        error={!!error}
                        placeholder="Variable*"
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
                              {value?.name ? 'Change' : 'Add'} Output Variable
                            </Button>
                          </InputAdornment>
                        }
                      />
                      {error?.message && (
                        <FormHelperText error>{error.message}</FormHelperText>
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
                      placeholder="Expression*"
                      onChange={onChange}
                      name="expressionString"
                      ref={expressionEditorRef}
                      errorMessage={fieldState?.error?.message}
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
      </StepContentWrapper>
      <VariablesDialog
        showAttributes={dataDictMode !== DataDictMode.Variable}
        data={
          dataDictMode === DataDictMode.Variable
            ? variableFieldDataDict
            : allVariables
        }
        integrationData={
          dataDictMode === DataDictMode.Variable
            ? undefined
            : integrationVariables
        }
        title={
          dataDictMode === DataDictMode.Variable
            ? 'Add Output Variable'
            : 'Add Input Variable'
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
          setDataDictMode(null);
        }}
        setSelectedObjectPropertyFunction={(object, property) => ({
          ...property,
          // Technically is not correct data type, but for calculations this is backend requirement -
          // for now this row brake the decision table flow with -> user vars
          dataType: object.dataType
        })}
      />
      <Paper elevation={1} sx={{ marginTop: '10px' }}>
        <Divider />
        <Box px={3} py={2}>
          <Stack
            flexDirection="row"
            justifyContent="end"
            alignItems="flex-start"
            gap={1}
          >
            <LoadingButton
              loading={isSubmitting}
              disabled={isSubmitting}
              variant="contained"
              color="primary"
              type="submit"
            >
              Save Expression
            </LoadingButton>
            <Button variant="outlined" onClick={onCancelClick}>
              Cancel
            </Button>
          </Stack>
        </Box>
        <Divider />
      </Paper>
    </form>
  );
};
