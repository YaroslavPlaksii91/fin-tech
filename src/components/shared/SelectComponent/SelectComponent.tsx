import { useState } from 'react';
import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

type SelectComponentProps = {
  options: string[] | string;
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

  const getFormatedOptions = () => {
    // in case API returns array in string "[ContactTime.Morning,ContactTime.Afternoon]"
    if (typeof options === 'string') {
      return options.replace(/\[|\]/g, '').split(',');
    }

    return options;
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
        {getFormatedOptions().map((option: string) => (
          <MenuItem value={option} key={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
