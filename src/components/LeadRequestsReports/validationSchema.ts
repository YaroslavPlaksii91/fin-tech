// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';

import rangeValidationSchema from '@components/shared/Forms/Range/validationSchema';

const validationSchema = yup.object().shape({
  leadPrice: rangeValidationSchema,
  requestedAmount: rangeValidationSchema,
  requestDate: yup.object().shape({
    from: yup
      .mixed<Dayjs | null>()
      .nullable()
      .test(
        'is-dayjs',
        'Invalid date format',
        (value) => value === null || dayjs.isDayjs(value)
      ),
    to: yup
      .mixed<Dayjs | null>()
      .nullable()
      .test(
        'is-dayjs',
        'Invalid date format',
        (value) => value === null || dayjs.isDayjs(value)
      )
      .test(
        'is-greater',
        'Date To must be greater than Date From',
        function (value) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { from } = this.parent;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return !from || !value || dayjs(value).isAfter(dayjs(from));
        }
      )
  })
});

export default validationSchema;
