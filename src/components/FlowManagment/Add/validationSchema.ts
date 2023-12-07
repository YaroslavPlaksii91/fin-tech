import * as yup from 'yup';

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('flow name is required')
    .max(30, 'Flow name cannot have more than 30 characters')
});

export default validationSchema;
