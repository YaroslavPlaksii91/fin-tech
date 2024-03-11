import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  outputVariableName: yup.string().trim().required('Variable is required'),
  expressionString: yup.string().trim().required('Expression is required')
});

export default validationSchema;
