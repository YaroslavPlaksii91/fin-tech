import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import { FormControl, InputProps, Select } from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

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
  sx?: SxProps<Theme> | undefined;
  disabled: boolean;
}

export const SingleSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  displayEmpty = false,
  children,
  sx,
  fullWidth = false,
  disabled = false
}: InputProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl
      error={!!fieldState?.error}
      sx={sx}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      <Select {...field} displayEmpty={displayEmpty}>
        {children}
      </Select>
      {fieldState?.error && (
        <StyledError variant="caption">{fieldState.error.message}</StyledError>
      )}
    </FormControl>
  );
};
