import {
  Autocomplete as MuiAutocomplete,
  Checkbox,
  TextField,
  MenuItem,
  ListItemText,
  InputAdornment,
  Divider,
  IconButton
} from '@mui/material';
import { useCallback, useState } from 'react';
import {
  useController,
  FieldValues,
  FieldPath,
  UseControllerProps
} from 'react-hook-form';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import CloseIcon from '@icons/cross.svg';
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
  label,
  fieldPath
}: AutocompleteProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = useCallback(async () => {
    setOpen((prev) => !prev);
    if (options.length) return;
    try {
      setLoading(true);
      const data = await getOption(fieldPath);
      const filteredOptions = data.filter((item) => item);
      const filledOptions = filteredOptions?.length
        ? [...filteredOptions, SELECT_DESELECT_ALL]
        : [];
      setOptions(filledOptions);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [options]);

  const handleClose = () => {
    setOpen(false);
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
      clearIcon={<CloseIcon />}
      renderTags={(selected) =>
        selected.map((option, index) => (
          <span style={{ padding: '0 2.5px' }} key={index}>
            {option},
          </span>
        ))
      }
      renderOption={(props, option) => {
        const isSelected = ((field.value as string[]) || []).includes(option);
        return (
          <>
            {option === SELECT_DESELECT_ALL ? (
              <>
                <Divider sx={{ marginTop: 0 }} />
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
              </>
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
          label={label}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                <InputAdornment
                  sx={{ position: 'absolute', right: '8px', top: '50%' }}
                  position="end"
                >
                  <IconButton disabled={loading} onClick={handleOpen}>
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )}
                  </IconButton>
                </InputAdornment>
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
