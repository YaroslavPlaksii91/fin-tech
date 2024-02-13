import * as yup from 'yup';

import { OPERATORS } from '../constants';

export const validationSchema = yup.object().shape({
  operator: yup.string().required(),
  value: yup
    .string()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.Any || OPERATORS.Between
        ? schema.notRequired()
        : schema.required()
    ),
  lowestValue: yup
    .string()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.Between ? schema.required() : schema.nullable()
    ),
  highestValue: yup
    .string()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.Between ? schema.required() : schema.nullable()
    )
});

export default validationSchema;
