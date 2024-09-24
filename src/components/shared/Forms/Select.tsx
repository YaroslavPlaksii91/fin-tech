import {
  FieldPath,
  FieldValues,
  UseControllerProps,
  useController
} from 'react-hook-form';
import {
  FormControl,
  FormControlProps,
  SelectProps as MuiSelectProps,
  Select as MuiSelect,
  InputLabel,
  MenuItem,
  ListItemText,
  Checkbox,
  IconButton
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { StyledError } from './styled';

import CloseIcon from '@icons/cross.svg';

export type Option = {
  label: string;
  value: string | number;
};

interface SelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;
  options: Option[];
}

const Select = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  options,
  label,
  multiple = false,
  clearable = false,
  ...props
}: SelectProps<TFieldValues, TName> & MuiSelectProps & FormControlProps) => {
  const { field, fieldState } = useController({ control, name });

  const handleClearOptions = () => field.onChange(multiple ? [] : '');

  return (
    <FormControl error={!!fieldState?.error} size="small" {...props}>
      {label ? <InputLabel id="label">{label}</InputLabel> : null}
      <MuiSelect
        labelId="label"
        id="select"
        label={label}
        multiple={multiple}
        IconComponent={KeyboardArrowDownIcon}
        renderValue={() =>
          multiple
            ? (field.value as Option['value'][])?.join(', ')
            : field.value
        }
        {...field}
        MenuProps={{ sx: { '.MuiMenu-paper': { maxHeight: '450px' } } }}
        endAdornment={
          clearable && field.value.length > 0 ? (
            <IconButton
              sx={{ position: 'absolute', right: '24px' }}
              size="small"
              aria-label="clear-options"
              onClick={handleClearOptions}
            >
              <CloseIcon />
            </IconButton>
          ) : null
        }
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value} sx={{ height: '36px' }}>
            {multiple ? (
              <Checkbox
                checked={Boolean(
                  (field.value as Option['value'][]).find(
                    (selectedOption) => selectedOption === option.value
                  )
                )}
              />
            ) : null}
            <ListItemText sx={{ margin: 0 }} primary={option.label} />
          </MenuItem>
        ))}
      </MuiSelect>
      {fieldState?.error && (
        <StyledError variant="caption">{fieldState.error.message}</StyledError>
      )}
    </FormControl>
  );
};

export default Select;
