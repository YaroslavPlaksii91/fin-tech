import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Step name is required')
    .max(30, 'Step name cannot have more than 30 characters')
});

export default validationSchema;
