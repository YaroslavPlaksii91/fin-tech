import * as yup from 'yup';

import { OPERATORS } from '../constants';

export const validationSchema = yup.object().shape({
  operator: yup.string().required(),
  value: yup
    .string()
    .when('operator', ([operator], schema) =>
      operator === OPERATORS.Any ? schema.notRequired() : schema.required()
    )
});

export default validationSchema;
