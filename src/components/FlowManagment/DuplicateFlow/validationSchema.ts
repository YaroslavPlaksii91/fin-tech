import * as yup from 'yup';

export type FormData = {
  name: string;
};

export const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Flow name is required')
    .max(30, 'Flow name cannot have more than 30 characters')
});
