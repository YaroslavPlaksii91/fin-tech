import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import {
  FormControl,
  SelectProps,
  FormControlProps,
  Select
} from '@mui/material';

import { StyledError } from './styled';

interface SingleSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder?: string;
  children: React.ReactNode;
  displayEmpty?: boolean;
}

export const SingleSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  displayEmpty = false,
  children,
  ...props
}: SingleSelectProps<TFieldValues, TName> & SelectProps & FormControlProps) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl error={!!fieldState?.error} {...props}>
      <Select {...field} displayEmpty={displayEmpty}>
        {children}
      </Select>
      {fieldState?.error && (
        <StyledError variant="caption">{fieldState.error.message}</StyledError>
      )}
    </FormControl>
  );
};
