import * as yup from 'yup';

import { MAX_INTEGER_VALUE } from '../constants';

import {
  VARIABLE_SOURCE_TYPE,
  VARIABLE_DATA_TYPE,
  CONTROL_FILES,
  DataDictionaryVariables
} from '@domain/dataDictionary';
import { isDecimal, isInteger, isStringArray } from '@utils/validation';

export const validationSchema = ({
  variables,
  isEdit
}: {
  variables: DataDictionaryVariables;
  isEdit: boolean;
}) =>
  yup.object().shape({
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
      )
      .test(
        'is-unique',
        'Variable with the specified name already exists, please choose a unique name',
        (val: string) => {
          if (isEdit) return true;

          const isExist = Object.values(variables)
            .flat()
            .some(({ name }) => name === val);

          return !isExist;
        }
      ),
    sourceType: yup
      .mixed<VARIABLE_SOURCE_TYPE | CONTROL_FILES>()
      .oneOf(Object.values(VARIABLE_SOURCE_TYPE))
      .required(),
    dataType: yup
      .mixed<VARIABLE_DATA_TYPE>()
      .oneOf(Object.values(VARIABLE_DATA_TYPE))
      .required(),
    defaultValue: yup.string().when('dataType', {
      is: (val: VARIABLE_DATA_TYPE) =>
        [
          VARIABLE_DATA_TYPE.Decimal,
          VARIABLE_DATA_TYPE.Boolean,
          VARIABLE_DATA_TYPE.DateTime,
          VARIABLE_DATA_TYPE.Integer,
          VARIABLE_DATA_TYPE.StringArray
        ].includes(val),
      then: (schema) =>
        schema
          .required('Default value is required')
          .test(
            'is-decimal',
            'Default value must be a valid decimal',
            function (value) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              return this.parent.dataType === VARIABLE_DATA_TYPE.Decimal
                ? isDecimal(value)
                : true;
            }
          )
          .test(
            'is-integer',
            'Default value must be a valid integer',
            function (value) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              return this.parent.dataType === VARIABLE_DATA_TYPE.Integer
                ? isInteger(value)
                : true;
            }
          )
          .test(
            'max-integer-value',
            `Integer value cannot exceed ${MAX_INTEGER_VALUE}`,
            function (value) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              return this.parent.dataType === VARIABLE_DATA_TYPE.Integer
                ? Number(value) <= MAX_INTEGER_VALUE
                : true;
            }
          )
          .test(
            'is-string-array',
            'Default value must be an empty array or an array of strings, each wrapped in double quotes',
            function (value) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              return this.parent.dataType === VARIABLE_DATA_TYPE.StringArray
                ? isStringArray(value)
                : true;
            }
          )
    }),
    description: yup
      .string()
      .trim()
      .max(100, 'Description cannot have more than 100 characters')
  });

export default validationSchema;
