import * as yup from 'yup';

import rangeValidationSchema from '@components/shared/Forms/Range/validationSchema';
import rangeDateValidationSchema from '@components/shared/Forms/DatePicker/validationSchema';

const validationSchema = yup.object().shape({
  leadPrice: rangeValidationSchema,
  requestedAmount: rangeValidationSchema,
  ...rangeDateValidationSchema('requestDate').fields
});

export default validationSchema;
