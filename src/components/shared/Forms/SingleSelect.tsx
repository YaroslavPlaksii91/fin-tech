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
  Select,
  InputLabel
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
  label,
  ...props
}: SingleSelectProps<TFieldValues, TName> & SelectProps & FormControlProps) => {
  const { field, fieldState } = useController({ control, name });

  return (
    <FormControl error={!!fieldState?.error} {...props}>
      {/* TODO: styles make re-usable */}
      {label && (
        <InputLabel
          sx={{
            position: 'relative',
            left: '-10px',
            top: '8px',
            color: 'rgba(0, 0, 0, 0.6)!important'
          }}
        >
          {label}
        </InputLabel>
      )}
      <Select {...field} displayEmpty={displayEmpty}>
        {children}
      </Select>
      {fieldState?.error && (
        <StyledError variant="caption">{fieldState.error.message}</StyledError>
      )}
    </FormControl>
  );
};
