import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import { FormControl, InputLabel } from '@mui/material';

import { StyledError } from '../styled';

import { StyledTextarea } from './styled';

const DEFAULT_MIN_ROWS = 8;

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label: string;
  placeholder?: string;
  fullWidth?: boolean;
  type?: string;
  minRows?: number;
}

const Textarea = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  fullWidth = false,
  minRows = DEFAULT_MIN_ROWS
}: InputProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl fullWidth={fullWidth} variant="standard">
      <InputLabel sx={{ position: 'static' }} shrink htmlFor={name}>
        {label}
      </InputLabel>
      <StyledTextarea
        minRows={minRows}
        id={name}
        placeholder={placeholder}
        {...field}
      />
      {fieldState?.error && (
        <StyledError variant="caption">{fieldState.error.message}</StyledError>
      )}
    </FormControl>
  );
};

export default Textarea;
