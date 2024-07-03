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
    .required('Variable name is a required field')
    .test(
      'no-dash',
      'Variable name cannot have dash characters',
      (val: string) => {
        if (val != undefined) return /^((?!-).)*$/.test(val);
        return true;
      }
    )
    .test(
      'no-space',
      'Variable name cannot contain space characters',
      (val: string) => {
        if (val != undefined) return /^[^\s]*$/.test(val);
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
  defaultValue: yup.string().when('dataType', {
    is: (val: DATA_TYPE_WITHOUT_ENUM) =>
      [
        DATA_TYPE_WITHOUT_ENUM.Decimal,
        DATA_TYPE_WITHOUT_ENUM.Boolean,
        DATA_TYPE_WITHOUT_ENUM.DateTime,
        DATA_TYPE_WITHOUT_ENUM.Integer
      ].includes(val),
    then: (schema) =>
      schema
        .required('Default value is required')
        .test(
          'is-decimal',
          'Default value must be a valid decimal',
          function (val) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (this.parent.dataType === DATA_TYPE_WITHOUT_ENUM.Decimal) {
              return (
                val !== undefined &&
                !isNaN(+val) &&
                parseFloat(val).toString() === val &&
                !Number.isInteger(parseFloat(val))
              );
            }
            return true;
          }
        )
        .test(
          'is-integer',
          'Default value must be a valid integer',
          function (val) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (this.parent.dataType === DATA_TYPE_WITHOUT_ENUM.Integer) {
              return (
                val !== undefined &&
                !isNaN(+val) &&
                Number.isInteger(parseFloat(val))
              );
            }
            return true;
          }
        )
  }),
  description: yup
    .string()
    .trim()
    .max(100, 'Description cannot have more than 100 characters')
});

export default validationSchema;
