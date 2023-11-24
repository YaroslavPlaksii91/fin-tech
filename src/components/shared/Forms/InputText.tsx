import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import TextField from '@mui/material/TextField';

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
}

export const InputText = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label
}: InputProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <TextField
      error={!!fieldState?.error}
      helperText={fieldState?.error?.message}
      label={label}
      {...field}
    />
  );
};

// type InputProps<
//   TFieldValues extends FieldValues,
//   TName extends FieldPath<TFieldValues>
// > = UseControllerProps<TFieldValues, TName> & {
//   label: string;
// };

// export const InputText = <
//   TFieldValues extends FieldValues,
//   TName extends FieldPath<TFieldValues>
// >({
//   control,
//   name,
//   label
// }: InputProps<TFieldValues, TName>) => {
//   const { field, fieldState } = useController({ control, name });

//   return (
//     <TextField
//       label={label}
//       error={!!fieldState?.error}
//       helperText={fieldState?.error?.message}
//       {...field}
//     />
//   );
// };
