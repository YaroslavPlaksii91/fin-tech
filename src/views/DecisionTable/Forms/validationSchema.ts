import * as yup from 'yup';

import { Operator, OPERATORS, VALUE_TYPES, ValueType } from '../types';

import { isDecimal, isInteger } from '@utils/validation';
import { checkDataType } from '@components/DataDictionaryVariables/utils';

export const validationSchema = (dataType: ReturnType<typeof checkDataType>) =>
  yup.object().shape({
    name: yup.string().required(),
    operator: yup
      .mixed<Operator | ''>()
      .oneOf(Object.values(OPERATORS), 'Operator is required')
      .required(),
    type: yup
      .mixed<ValueType>()
      .oneOf(Object.values(VALUE_TYPES), 'Type is required')
      .required(),
    value: yup
      .mixed<string | string[]>()
      .when(['operator', 'type'], ([operator, type], schema) => {
        if (
          operator === OPERATORS.ANY ||
          operator === OPERATORS.BETWEEN ||
          type === VALUE_TYPES.Variable
        )
          return schema.notRequired().nullable();

        if (dataType.isWithEnum) {
          return schema
            .required('Value is required')
            .test(
              'is-single',
              "Value must be a single with operators '=' and '!='",
              (value) =>
                [OPERATORS.EQUAL, OPERATORS.NOT_EQUAL].includes(
                  operator as OPERATORS
                )
                  ? value.length <= 1
                  : true
            )
            .test(
              'is-empty',
              'Value is required',
              (value) => value.length !== 0
            );
        }

        return yup
          .string()
          .required('Value is required')
          .test('is-decimal', 'Value must be a valid decimal', (value) =>
            dataType.isDecimal ? isDecimal(value) : true
          )
          .test('is-integer', 'Value must be a valid integer', (value) =>
            dataType.isInteger ? isInteger(value) : true
          );
      }),
    lowerBound: yup.string().when(['operator'], ([operator], schema) =>
      operator === OPERATORS.BETWEEN
        ? schema
            .required('Lowest value is required')
            .test(
              'is-decimal',
              'Lowest value must be a valid decimal',
              (value) => (dataType.isDecimal ? isDecimal(value) : true)
            )
            .test(
              'is-integer',
              'Lowest value must be a valid integer',
              (value) => (dataType.isInteger ? isInteger(value) : true)
            )
        : schema.notRequired().nullable()
    ),
    upperBound: yup
      .string()
      .when(['operator', 'lowerBound'], ([operator, lowerBound], schema) =>
        operator === OPERATORS.BETWEEN
          ? schema
              .required('Highest value is required')
              .test(
                'is-decimal',
                'Lowest value must be a valid decimal',
                (value) => (dataType.isDecimal ? isDecimal(value) : true)
              )
              .test(
                'is-integer',
                'Lowest value must be a valid integer',
                (value) => (dataType.isInteger ? isInteger(value) : true)
              )
              .test(
                'is-greater-than-lowerBound',
                'Highest value must be greater than the lowest value',
                (upperBound) => +upperBound > +lowerBound
              )
          : schema.notRequired().nullable()
      )
  });

export default validationSchema;
