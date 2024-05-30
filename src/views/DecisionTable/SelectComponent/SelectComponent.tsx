import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

interface SelectComponentProps {
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  isMultiSelect?: boolean;
  fullWidth: boolean;
  handleChange: (selectedValue: string) => void;
}

const SelectComponent = ({
  placeholder,
  value,
  options,
  isMultiSelect = false,
  fullWidth = false,
  handleChange
}: SelectComponentProps) => {
  const handleOnSelectChange = (event: SelectChangeEvent<string>) => {
    handleChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth}>
      {!value ? (
        <InputLabel
          sx={{
            transform: 'none',
            typography: 'body2'
          }}
        >
          {placeholder}
        </InputLabel>
      ) : null}
      <Select
        fullWidth={fullWidth}
        sx={{
          '& .MuiSelect-select': {
            padding: 0
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          }
        }}
        size="small"
        value={value}
        onChange={handleOnSelectChange}
        multiple={isMultiSelect}
      >
        {options.map((option) => (
          <MenuItem value={option.value} key={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
