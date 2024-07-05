import { Control, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';

import { IFormState, IInputGroup } from './types';

interface InputFiltersProps {
  inputGroupsToshow?: IInputGroup[];
  control: Control<IFormState>;
}

export const InputFilters = ({
  inputGroupsToshow,
  control
}: InputFiltersProps) =>
  (inputGroupsToshow || []).map(({ field, placeholder }) => (
    <Controller
      control={control}
      name={`inputFilters.${field}`}
      key={field}
      render={({ field: { value, onChange } }) => (
        <TextField
          fullWidth
          placeholder={placeholder}
          type="text"
          size="small"
          value={value}
          onChange={onChange}
        />
      )}
    />
  ));
