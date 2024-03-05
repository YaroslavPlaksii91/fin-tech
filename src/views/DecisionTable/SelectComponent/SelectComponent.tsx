import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

import { CATEGORIES, CATEGORIES_WITHOUT_ELSE_ACTIONS } from '../constants';

type SelectComponentProps = {
  rowIndex: number;
  category: CATEGORIES;
  variableName: string;
  value: string;
  options: string[] | string;
  isMultiSelect?: boolean;
  fullWidth: boolean;
  handleSubmitVariableValueForEnum: ({
    rowIndex,
    variableName,
    newEnumValue,
    category
  }: {
    rowIndex: number;
    variableName: string;
    newEnumValue: string;
    category: CATEGORIES_WITHOUT_ELSE_ACTIONS;
  }) => void;
};

const SelectComponent = ({
  rowIndex,
  category,
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
      newEnumValue: event.target.value,
      category: category as CATEGORIES_WITHOUT_ELSE_ACTIONS
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
