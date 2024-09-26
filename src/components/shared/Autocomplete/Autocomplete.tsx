import {
  Autocomplete as MuiAutocomplete,
  Checkbox,
  TextField,
  MenuItem,
  ListItemText
} from '@mui/material';
import { useState } from 'react';
import {
  useController,
  FieldValues,
  FieldPath,
  UseControllerProps
} from 'react-hook-form';

import { CircularProgress } from '@components/shared/Icons';

type Option = { label: string; value: string | number };

type AutocompleteProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = UseControllerProps<TFieldValues, TName> & {
  placeholder: string;
  label: string;
  id: string;
  fieldPath: string;
  getOption: (field: string) => Promise<string[]>;
};

const Autocomplete = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  id,
  name,
  placeholder,
  getOption,
  fieldPath
}: AutocompleteProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    try {
      setLoading(true);
      const data = await getOption(fieldPath);
      const formattedOptions = data
        .filter((item) => item)
        .map((item) => ({
          label: item,
          value: item
        }));
      setOptions(formattedOptions);
    } catch {
      // set something went wrong title
    } finally {
      setOpen(true);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <MuiAutocomplete
      multiple
      fullWidth
      id={id}
      options={options}
      disableCloseOnSelect
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      loading={loading}
      renderTags={(selected) =>
        selected.map((option, index) => (
          <span key={index}> {option.label}, </span>
        ))
      }
      renderOption={(props, option: Option) => {
        const isSelected = (field.value || []).some(
          (selectedOption: Option) => selectedOption.value === option.value
        );
        return (
          <MenuItem
            {...props}
            key={option.value}
            value={option.value}
            sx={{ height: '36px' }}
          >
            <Checkbox style={{ marginRight: 8 }} checked={isSelected} />
            <ListItemText sx={{ margin: 0 }} primary={option.label} />
          </MenuItem>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder={placeholder}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          value={field.value || []}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      onChange={(_, data) => field.onChange(data)}
      value={field.value || []}
    />
  );
};

export default Autocomplete;
