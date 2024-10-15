import React from 'react';
import { Stack, InputAdornment, Typography } from '@mui/material';
import { Control } from 'react-hook-form';

import { getFormattedOptions } from '../utils';
import { VALUE_TYPES, FormFieldsProps } from '../types';

import InputText from '@components/shared/Forms/InputText';
import Select from '@components/shared/Forms/Select';

interface ContentProps {
  control: Control<FormFieldsProps>;
  isOperatorDisabled: boolean;
  isValueSelectMultiple: boolean;
  isValueSelectDisabled: boolean;
  isValueInputDisabled: boolean;
  hasBounds: boolean;
  hasValueAsSelect: boolean;
  operatorOptions: { label: string; value: string }[];
  valueOptions: { label: string; value: string }[];
  valueLabel: string;
}

const Content: React.FC<ContentProps> = ({
  control,
  isOperatorDisabled,
  isValueSelectMultiple,
  isValueSelectDisabled,
  isValueInputDisabled,
  hasBounds,
  hasValueAsSelect,
  operatorOptions,
  valueOptions,
  valueLabel
}) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={{ xs: 1, sm: 2, md: 2 }}
    sx={{ mb: '20px' }}
  >
    <InputText
      fullWidth
      disabled
      label="Variable*"
      name="name"
      control={control}
      InputProps={{
        startAdornment: !isOperatorDisabled && (
          <InputAdornment position="start">
            <Typography variant="body1" sx={{ padding: '0 8x 0 0' }}>
              IF
            </Typography>
          </InputAdornment>
        )
      }}
    />
    <Select
      name="operator"
      control={control}
      disabled={isOperatorDisabled}
      sx={{
        width: '280px',
        minWidth: '140px'
      }}
      label="Operator*"
      options={operatorOptions}
    />
    <Select
      name="type"
      control={control}
      sx={{
        width: '280px',
        minWidth: '158px'
      }}
      label="Type*"
      options={getFormattedOptions(Object.values(VALUE_TYPES))}
    />
    {hasValueAsSelect ? (
      <Select
        name="value"
        multiple={isValueSelectMultiple}
        control={control}
        fullWidth
        label="Value*"
        disabled={isValueSelectDisabled}
        options={valueOptions}
      />
    ) : hasBounds ? (
      <>
        <InputText
          fullWidth
          name="lowerBound"
          control={control}
          label="Lowest Value*"
        />
        <InputText
          fullWidth
          name="upperBound"
          control={control}
          label="Highest Value*"
        />
      </>
    ) : (
      <InputText
        fullWidth
        name="value"
        control={control}
        label={valueLabel}
        disabled={isValueInputDisabled}
      />
    )}
  </Stack>
);

export default Content;
