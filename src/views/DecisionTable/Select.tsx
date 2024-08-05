import {
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent
} from '@mui/material';

interface SelectProps {
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  isMultiSelect?: boolean;
  fullWidth: boolean;
  handleChange: (selectedValue: string) => void;
  disabled?: boolean;
}

const Select = ({
  placeholder,
  value,
  options,
  isMultiSelect = false,
  fullWidth = false,
  handleChange,
  disabled
}: SelectProps) => {
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
      <MuiSelect
        fullWidth={fullWidth}
        sx={{
          '& .MuiSelect-select': {
            padding: 0,
            fontSize: '14px'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          }
        }}
        size="small"
        value={value}
        onChange={handleOnSelectChange}
        multiple={isMultiSelect}
        disabled={disabled}
      >
        {options.map((option) => (
          <MenuItem value={option.value} key={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
};

export default Select;
