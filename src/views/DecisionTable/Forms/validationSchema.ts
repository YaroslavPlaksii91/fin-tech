import * as yup from 'yup';

import { Operator, OPERATORS } from '../types';

import {
  DATA_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE_WITH_ENUM_PREFIX
} from '@domain/dataDictionary';
import { isDecimal, isInteger } from '@utils/validation';

export const validationSchema = yup.object().shape({
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
  value: yup
    .string()
    .when(['dataType', 'operator'], ([dataType, operator], schema) => {
      if (operator === OPERATORS.ANY || operator === OPERATORS.BETWEEN)
        return schema.notRequired().nullable();

      return schema
        .required('Value is required')
        .test('is-decimal', 'Value must be a valid decimal', (value) =>
          dataType === DATA_TYPE_WITHOUT_ENUM.Decimal ? isDecimal(value) : true
        )
        .test('is-integer', 'Value must be a valid integer', (value) =>
          dataType === DATA_TYPE_WITHOUT_ENUM.Integer ? isInteger(value) : true
        );
    }),
  lowerBound: yup
    .number()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.BETWEEN
        ? schema.required()
        : schema.notRequired().nullable()
    ),
  upperBound: yup
    .number()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.BETWEEN
        ? schema.required()
        : schema.notRequired().nullable()
    )
});

export default validationSchema;
