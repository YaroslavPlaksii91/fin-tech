import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import {
  FormControl,
  InputLabel,
  FilledInputProps,
  OutlinedInputProps,
  InputProps
} from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder: string;
  fullWidth?: boolean;
  type?: string;
  inputProps?: Partial<FilledInputProps> | Partial<OutlinedInputProps>;
  sx?: SxProps<Theme>;
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
  fullWidth = false,
  inputProps,
  sx,
  ...props
}: InputProps<TFieldValues, TName> & TextFieldProps) => {
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
        InputProps={inputProps}
        sx={sx}
        {...field}
        {...props}
      />
    </FormControl>
  );
};
