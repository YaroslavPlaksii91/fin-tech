import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

type DateRange = {
  from: Dayjs | null;
  to: Dayjs | null;
};

const rangeDateValidationSchema = (fieldName: string) =>
  yup.object().shape({
    [fieldName]: yup.object().shape({
      from: yup
        .mixed<Dayjs>()
        .nullable()
        .test(
          'is-dayjs',
          'Invalid date format',
          (value) => value === null || dayjs.isDayjs(value)
        ),
      to: yup
        .mixed<Dayjs>()
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
            const { from } = this.parent as DateRange;

            return !from || !value || dayjs(value).isSameOrAfter(dayjs(from));
          }
        )
    })
  });

export default rangeDateValidationSchema;
