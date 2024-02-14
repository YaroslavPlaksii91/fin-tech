import { useState } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

type OptionProps = {
  value: string;
  label: string;
};

type SelectComponentProps = {
  options: OptionProps[];
  name?: string;
  isMultiSelect?: boolean;
  fullWidth: boolean;
};

const SelectComponent = ({
  name,
  options,
  isMultiSelect = false,
  fullWidth = false
}: SelectComponentProps) => {
  const [selectedEnumOptions, setSelectedEnumOptions] = useState('');

  const handleOnSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedEnumOptions(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size="small">
      <Select
        value={selectedEnumOptions}
        onChange={handleOnSelectChange}
        multiple={isMultiSelect}
        sx={{ minWidth: 200 }}
        name={name}
      >
        {options.map((option: OptionProps) => (
          <MenuItem value={option.value} key={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
