import * as yup from 'yup';

import { Operator, OPERATORS } from '../types';

import { DATA_TYPE_WITHOUT_ENUM } from '@domain/dataDictionary';

export const validationSchema = yup.object().shape({
  name: yup.string().required(),
  dataType: yup
    .mixed<DATA_TYPE_WITHOUT_ENUM>()
    .oneOf([...Object.values(DATA_TYPE_WITHOUT_ENUM)])
    .notRequired()
    .nullable(),
  operator: yup.mixed<Operator>().oneOf(Object.values(OPERATORS)).required(),
  value: yup
    .string()
    .when(['dataType', 'operator'], ([dataType, operator], schema) => {
      if (operator === OPERATORS.ANY || operator === OPERATORS.BETWEEN)
        return schema.notRequired().nullable();

      if (
        dataType === DATA_TYPE_WITHOUT_ENUM.Integer ||
        dataType === DATA_TYPE_WITHOUT_ENUM.Decimal
      )
        return yup.number().required();

      return yup.string().required();
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
