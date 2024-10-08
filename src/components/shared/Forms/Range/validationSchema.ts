import * as yup from 'yup';

const getMinValueValidation = () =>
  yup
    .string()
    .test('is-number', 'From must be a number', (value) =>
      value ? !isNaN(Number(value)) : true
    )
    .test(
      'is-greater-than-to',
      "From value can't be greater than To value",
      (value, { parent }: { parent: { to?: string } }) =>
        !value || !parent.to ? true : Number(value) <= Number(parent.to)
    );

const getMaxValueValidation = () =>
  yup
    .string()
    .test('is-number', 'To must be a number', (value) =>
      value ? !isNaN(Number(value)) : true
    )
    .test(
      'is-less-than-from',
      "To value can't be less than From value",
      (value, { parent }: { parent: { from?: string } }) =>
        !value || !parent.from ? true : Number(value) >= Number(parent.from)
    );

const validationSchema = yup.object().shape({
  from: getMinValueValidation(),
  to: getMaxValueValidation()
});

export default validationSchema;
