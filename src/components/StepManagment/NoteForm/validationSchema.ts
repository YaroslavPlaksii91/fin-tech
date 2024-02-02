import * as yup from 'yup';

export const validationSchema = yup.object().shape({
  note: yup
    .string()
    .trim()
    .max(100, 'Note name cannot have more than 100 characters')
});

export default validationSchema;
