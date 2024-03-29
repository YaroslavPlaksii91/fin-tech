import * as yup from 'yup';

import {
  VARIABLE_SOURCE_TYPE,
  DATA_TYPE_WITHOUT_ENUM,
  DATA_TYPE
} from '@domain/dataDictionary';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .max(30, 'Variable name cannot have more than 30 characters')
    .required()
    .test(
      'no-dash',
      'Variable name cannot have dash characters',
      (val: string) => {
        if (val != undefined) {
          return /^((?!-).)*$/.test(val);
        }
        return true;
      }
    ),
  sourceType: yup
    .mixed<VARIABLE_SOURCE_TYPE>()
    .oneOf(Object.values(VARIABLE_SOURCE_TYPE))
    .required(),
  dataType: yup
    .mixed<DATA_TYPE>()
    .oneOf(Object.values(DATA_TYPE_WITHOUT_ENUM))
    .required(),
  defaultValue: yup.string(),
  description: yup
    .string()
    .trim()
    .max(100, 'Description cannot have more than 100 characters')
});

export default validationSchema;
