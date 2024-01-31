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
  onChangeCb?: (index?: number) => void;
}

const NumberInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  onChangeCb,
  rangeMin = MIN_VALUE,
  rangeMax = MAX_VALUE
}: InputProps<TFieldValues, TName>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <StyledTextField
        type="number"
        onKeyDown={(event) => {
          if (event.key === '.' || event.key === '-') {
            event.preventDefault();
          }
        }}
        value={value}
        inputProps={{
          min: MIN_VALUE,
          max: MAX_VALUE,
          step: 1,
          pattern: '[0-9]*'
        }}
        onChange={(event) => {
          let inputValue: string | number = parseInt(event.target.value, 10);
          if (isNaN(inputValue)) {
            inputValue = '';
          }

          onChange(inputValue);
          onChangeCb?.();
        }}
        InputProps={{
          startAdornment: (
            <StyledInputAdornment position="start">
              <IconButton
                aria-label="Decrement"
                disabled={+value === rangeMin}
                onClick={() => {
                  onChange(+value - 1);
                  onChangeCb?.();
                }}
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
                disabled={!(+value < rangeMax)}
                onClick={() => {
                  onChange(+value + 1);
                  onChangeCb?.();
                }}
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
