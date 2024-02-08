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
  value: string;
  onChange: (name: string, value: string) => void;
  options: OptionProps[];
  name?: string;
  isMultiSelect?: boolean;
  fullWidth: boolean;
};

const SelectComponent = ({
  value,
  onChange,
  name,
  options,
  isMultiSelect = false,
  fullWidth = false
}: SelectComponentProps) => {
  const handleOnSelectChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.name, event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size="small">
      <Select
        value={value}
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
