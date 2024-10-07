import * as yup from 'yup';
import dayjs, { Dayjs } from 'dayjs';

type DateRange = {
  from: Dayjs | null;
  to: Dayjs | null;
};

const rangeDateValidationSchema = yup.object().shape({
  requestDate: yup.object().shape({
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
          return !from || !value || dayjs(value).isAfter(dayjs(from));
        }
      )
  })
});

export default rangeDateValidationSchema;
