import * as yup from 'yup';

const validationSchema = yup.object().shape({
  note: yup
    .string()
    .trim()
    .max(100, 'Note cannot have more than 100 characters')
});

export default validationSchema;
