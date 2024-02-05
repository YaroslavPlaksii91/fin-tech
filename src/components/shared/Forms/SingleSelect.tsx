import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';

import { FormControl, InputProps, Select } from '@mui/material';

import { StyledError } from './styled';

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
  displayEmpty?: boolean;
  styles?: string;
}

export const SingleSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  displayEmpty = false,
  children,
  styles,
  fullWidth = false
}: InputProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl error={!!fieldState?.error} sx={styles} fullWidth={fullWidth}>
      <Select {...field} displayEmpty={displayEmpty}>
        {children}
      </Select>
      {fieldState?.error && (
        <StyledError variant="caption">{fieldState.error.message}</StyledError>
      )}
    </FormControl>
  );
};
