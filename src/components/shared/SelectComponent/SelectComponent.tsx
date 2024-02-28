import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

type SelectComponentProps = {
  rowIndex: number;
  variableName: string;
  value: string;
  options: string[] | string;
  isMultiSelect?: boolean;
  fullWidth: boolean;
  handleSubmitVariableValueForEnum: ({
    rowIndex,
    variableName,
    newEnumValue
  }: {
    rowIndex: number;
    variableName: string;
    newEnumValue: string;
  }) => void;
};

const SelectComponent = ({
  rowIndex,
  variableName,
  value,
  options,
  isMultiSelect = false,
  fullWidth = false,
  handleSubmitVariableValueForEnum
}: SelectComponentProps) => {
  const handleOnSelectChange = (event: SelectChangeEvent<string>) => {
    handleSubmitVariableValueForEnum({
      rowIndex,
      variableName,
      newEnumValue: event.target.value
    });
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
        value={value}
        onChange={handleOnSelectChange}
        multiple={isMultiSelect}
        sx={{ minWidth: 200 }}
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
