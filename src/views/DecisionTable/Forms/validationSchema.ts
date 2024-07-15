import * as yup from 'yup';

import { OPERATORS } from '../constants';

export const validationSchema = yup.object().shape({
  name: yup.string().required(),
  operator: yup.string().required(),
  value: yup
    .string()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.Any || OPERATORS.Between
        ? schema.notRequired()
        : schema.required()
    ),
  lowerBound: yup
    .number()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.Between ? schema.required() : schema.nullable()
    ),
  upperBound: yup
    .number()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.Between ? schema.required() : schema.nullable()
    )
});

export default validationSchema;
