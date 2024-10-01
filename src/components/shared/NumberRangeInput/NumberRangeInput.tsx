import { Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';

import { AddIcon, RemoveIcon } from '../Icons';

import { StyledInputAdornment, StyledTextField } from './styled';

import { KEY_CODES } from '@constants/common';
import { theme } from '@theme';

const MIN_VALUE = 1;
const MAX_VALUE = 100;

interface InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  rangeMin?: number;
  rangeMax?: number;
  onChangeCb?: (index?: number) => void;
  disabled?: boolean;
}

const NumberRangeInput = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  onChangeCb,
  rangeMin = MIN_VALUE,
  rangeMax = MAX_VALUE,
  disabled
}: InputProps<TFieldValues, TName>) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value } }) => (
      <StyledTextField
        type="number"
        onKeyDown={(event) => {
          if (event.key === KEY_CODES.Dot || event.key === KEY_CODES.Minus) {
            event.preventDefault();
          }
        }}
        value={value}
        inputProps={{
          min: MIN_VALUE,
          max: MAX_VALUE,
          step: 1
        }}
        onChange={(event) => {
          let inputValue: string | number = parseInt(event.target.value, 10);
          if (isNaN(inputValue)) {
            inputValue = '';
          }

          onChange(inputValue);
          onChangeCb?.();
        }}
        disabled={disabled}
        InputProps={{
          startAdornment: (
            <StyledInputAdornment position="start">
              <Box
                sx={{ borderRight: `1px solid ${theme.palette.action.active}` }}
              >
                <IconButton
                  aria-label="Decrement"
                  disabled={+value <= rangeMin}
                  onClick={() => {
                    onChange(+value - 1);
                    onChangeCb?.();
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </Box>
            </StyledInputAdornment>
          ),
          endAdornment: (
            <StyledInputAdornment position="end">
              <Typography sx={{ mr: '2px' }}>%</Typography>
              <Box
                sx={{
                  borderLeft: `1px solid ${theme.palette.action.active}`
                }}
              >
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
              </Box>
            </StyledInputAdornment>
          )
        }}
      />
    )}
  />
);

export default NumberRangeInput;
