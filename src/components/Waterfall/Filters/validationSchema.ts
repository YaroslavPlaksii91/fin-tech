import * as yup from 'yup';

import rangeValidationSchema from '@components/shared/Forms/Range/validationSchema';
import { RANGE_FILTERS_KEYS } from '@pages/Waterfall/types';
import rangeDateValidationSchema from '@components/shared/Forms/DatePicker/validationSchema';

const validationSchema = yup.object().shape({
  [RANGE_FILTERS_KEYS.totalLooks]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalApproved]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalApprovalRate]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalCost]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalCPA]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalLeadCost]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalDataCost]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalTimeouts]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalCostSavings]: rangeValidationSchema,
  [RANGE_FILTERS_KEYS.totalCachedLead]: rangeValidationSchema,
  ...rangeDateValidationSchema('date').fields
});

export default validationSchema;
