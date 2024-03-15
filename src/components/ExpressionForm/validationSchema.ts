import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  variable: yup.object().nullable().required('Variable is required'),
  expressionString: yup.string().trim().required('Expression is required')
});

export default validationSchema;
