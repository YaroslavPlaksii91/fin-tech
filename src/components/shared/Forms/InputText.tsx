import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { FormControl } from '@mui/material';

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  type?: string;
}

const InputText = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  placeholder,
  type = 'text',
  fullWidth = false,
  ...props
}: InputProps<TFieldValues, TName> & TextFieldProps) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl fullWidth={fullWidth} variant="standard">
      <TextField
        placeholder={placeholder}
        size="small"
        error={!!fieldState?.error}
        helperText={fieldState?.error?.message}
        id={name}
        type={type}
        {...field}
        {...props}
      />
    </FormControl>
  );
};

export default InputText;
