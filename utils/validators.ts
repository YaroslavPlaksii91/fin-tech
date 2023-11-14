import * as Yup from 'yup';

const Validators = {
  email: (label: string) => Yup.string().label(label).email(),
  password: (label: string) => Yup.string().label(label).min(8),
  fieldConfirm: (
    ref: string,
    label: string,
    errorMessage = 'Fields are not matched'
  ) =>
    Yup.string()
      .label(label)
      .oneOf([Yup.ref(ref), ''], errorMessage),
  booleanTrue: (message = 'Field must be checked') =>
    Yup.bool().oneOf([true], message)
};

export default Validators;
