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

const SELECT_DESELECT_ALL = 'Select/Deselect All';

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
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    try {
      setLoading(true);
      const data = await getOption(fieldPath);
      const filteredOptions = data.filter((item) => item);
      const filledOptions = filteredOptions?.length
        ? [...filteredOptions, SELECT_DESELECT_ALL]
        : [];
      setOptions(filledOptions);
    } catch {
      // Handle error
    } finally {
      setOpen(true);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleSelectDeselectAll = () => {
    const isAllSelected = field.value.length === options.length - 1;
    if (isAllSelected) {
      field.onChange([]);
    } else {
      field.onChange(
        options.filter((option) => option !== SELECT_DESELECT_ALL)
      );
    }
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
      noOptionsText="No options"
      renderTags={(selected) =>
        selected.map((option, index) => <span key={index}>{option}, </span>)
      }
      renderOption={(props, option) => {
        const isSelected = ((field.value as string[]) || []).includes(option);
        return (
          <>
            {option === SELECT_DESELECT_ALL ? (
              <MenuItem
                {...props}
                key={option}
                value={option}
                onClick={handleSelectDeselectAll}
                sx={{ height: '36px' }}
              >
                <Checkbox
                  style={{ marginRight: 8 }}
                  checked={field.value.length === options.length - 1}
                />
                <ListItemText sx={{ margin: 0 }} primary={option} />
              </MenuItem>
            ) : (
              <MenuItem
                {...props}
                key={option}
                value={option}
                sx={{ height: '36px' }}
              >
                <Checkbox style={{ marginRight: 8 }} checked={isSelected} />
                <ListItemText sx={{ margin: 0 }} primary={option} />
              </MenuItem>
            )}
          </>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          placeholder={placeholder}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
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
