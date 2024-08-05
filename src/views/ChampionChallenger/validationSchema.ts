import * as yup from 'yup';

import { Split } from './types';

const validationSchema = yup.object().shape({
  note: yup
    .string()
    .trim()
    .max(100, 'Note cannot have more than 100 characters'),
  splits: yup
    .array()
    .of(
      yup.object().shape({
        percentage: yup
          .number()
          .typeError('Percentage must be a number')
          .required('Percentage is required')
          .min(1, 'Percentage for each split must be more than or equal to 1')
          .max(
            100,
            'Percentage for each split must be less than or equal to 100'
          ),
        value: yup.string().trim().required('Step is required')
      })
    )
    .test(
      'sumOfPercentages',
      'Total percentage must equal 100 or be below 100',
      function (value) {
        const hasValues = value?.length;

        if (!hasValues) {
          return true;
        }

        const splits = value as unknown as Split[];

        const totalPercentage = splits?.reduce(
          (sum, split) => sum + split.percentage,
          0
        );
        if (totalPercentage > 100) {
          throw this.createError({
            path: 'splits',
            message: 'The sum of all splits is above 100%'
          });
        } else if (totalPercentage < 100) {
          throw this.createError({
            path: 'splits',
            message: 'The sum of all splits is below 100%'
          });
        }
        return true;
      }
    )
    .test(
      'allStepsSelected',
      'Step selection is required for each split',
      function (value) {
        const hasValues = value?.length;

        if (!hasValues) {
          return true;
        }
        const splits = value as unknown as Split[];

        return splits.every((split) => split.value.trim() !== '');
      }
    )
});

export default validationSchema;
