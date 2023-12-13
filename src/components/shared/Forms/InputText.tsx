import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel } from '@mui/material';
interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  placeholder: string;
  fullWidth?: boolean;
  type?: string;
}

export const InputText = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  fullWidth = false
}: InputProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl fullWidth={fullWidth} variant="standard">
      <InputLabel sx={{ position: 'static' }} shrink htmlFor={name}>
        {label}
      </InputLabel>
      <TextField
        placeholder={placeholder}
        size="small"
        error={!!fieldState?.error}
        helperText={fieldState?.error?.message}
        id={name}
        type={type}
        {...field}
      />
    </FormControl>
  );
};
