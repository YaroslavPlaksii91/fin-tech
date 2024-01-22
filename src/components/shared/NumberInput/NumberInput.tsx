import IconButton from '@mui/material/IconButton';
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';

import { AddIcon, RemoveIcon } from '../Icons';

import { StyledInputAdornment, StyledTextField } from './styled';

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {}

const NumberInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name
}: InputProps<TFieldValues, TName>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <StyledTextField
        type="number"
        value={value as number}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = parseInt(e.target.value, 10);
          if (!isNaN(value)) {
            onChange(value);
          } else {
            onChange(0);
          }
        }}
        InputProps={{
          startAdornment: (
            <StyledInputAdornment position="start">
              <IconButton
                aria-label="Decrement"
                onClick={() => onChange(value - 1)}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
            </StyledInputAdornment>
          ),
          endAdornment: (
            <StyledInputAdornment position="end">
              %
              <IconButton
                aria-label="Increment"
                onClick={() => onChange(value + 1)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </StyledInputAdornment>
          )
        }}
      />
    )}
  />
);

export default NumberInput;
