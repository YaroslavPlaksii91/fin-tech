import * as yup from 'yup';

import { Operator, OPERATORS } from '../types';

import {
  DATA_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX
} from '@domain/dataDictionary';
import { isDecimal, isInteger } from '@utils/validation';
import { checkDataType } from '@views/DecisionTable/utils.ts';

export const validationSchema = (dataType: ReturnType<typeof checkDataType>) =>
  yup.object().shape({
    name: yup.string().required(),
    dataType: yup
      .mixed<DATA_TYPE>()
      .oneOf([
        ...Object.values(DATA_TYPE_WITHOUT_ENUM),
        ...Object.values(DATA_TYPE_WITH_ENUM_PREFIX)
      ])
      .notRequired()
      .nullable(),
    operator: yup
      .mixed<Operator | ''>()
      .oneOf(Object.values(OPERATORS), 'Operator is required')
      .required(),
    value: dataType.isWithEnum
      ? yup.array().when(['operator'], ([operator], schema) => {
          if (operator === OPERATORS.ANY)
            return schema.notRequired().nullable();

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
        })
      : yup.string().when(['operator'], ([operator], schema) => {
          if (operator === OPERATORS.ANY || operator === OPERATORS.BETWEEN)
            return schema.notRequired().nullable();

          return schema
            .required('Value is required')
            .test('is-decimal', 'Value must be a valid decimal', (value) =>
              dataType.isDecimal ? isDecimal(value) : true
            )
            .test('is-integer', 'Value must be a valid integer', (value) =>
              dataType.isInteger ? isInteger(value) : true
            );
        }),
    lowerBound: yup.number().when(['operator'], ([operator], schema) =>
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
    upperBound: yup.number().when(['operator'], ([operator], schema) =>
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
        : schema.notRequired().nullable()
    )
  });

export default validationSchema;
