import IconButton from '@mui/material/IconButton';
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';

import { AddIcon, RemoveIcon } from '../Icons';

import { StyledInputAdornment, StyledTextField } from './styled';

const MIN_VALUE = 0;
const MAX_VALUE = 100;

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  rangeMin?: number;
  rangeMax?: number;
}

const NumberInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  rangeMin = MIN_VALUE,
  rangeMax = MAX_VALUE
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
          // if (!isNaN(value)) {
          //   onChange(value);
          // } else {
          //   onChange(0);
          // }
          onChange(value);
        }}
        InputProps={{
          startAdornment: (
            <StyledInputAdornment position="start">
              <IconButton
                aria-label="Decrement"
                disabled={value === rangeMin}
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
                disabled={value === rangeMax}
                onClick={() => onChange(value + 1)}
              >
                {/* {console.log('value', value)} */}
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
