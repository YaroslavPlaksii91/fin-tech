import { Control, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

import { IFormState, IInputGroup } from './types';

interface InputFiltersProps {
  inputGroupsToShow?: IInputGroup[];
  control: Control<IFormState>;
}

export const InputFilters = ({
  inputGroupsToShow,
  control
}: InputFiltersProps) =>
  (inputGroupsToShow || []).map(({ field, placeholder, label }) => (
    <Controller
      control={control}
      name={`inputFilters.${field}`}
      key={field}
      render={({ field: { value, onChange } }) => (
        <TextField
          fullWidth
          label={label}
          placeholder={placeholder}
          type="text"
          size="small"
          value={value}
          onChange={onChange}
        />
      )}
    />
  ));
