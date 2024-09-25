import {
  Autocomplete as MuiAutocomplete,
  Checkbox,
  TextField
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useState } from 'react';
import {
  useController,
  FieldValues,
  FieldPath,
  UseControllerProps
} from 'react-hook-form';

import { CircularProgress } from '@components/shared/Icons';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Option = { title: string };

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

type AutocompleteProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = UseControllerProps<TFieldValues, TName> & {
  placeholder: string;
  label: string;
};

const Autocomplete = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  placeholder
}: AutocompleteProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ control, name });

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ title: string; year: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    void (async () => {
      setLoading(true);
      await sleep(1000);
      setLoading(false);
      setOptions([...topFilms]);
    })();
  };

  const handleClose = () => {
    setOpen(false);
    setOptions([]);
  };

  return (
    <MuiAutocomplete
      multiple
      fullWidth
      id="checkboxes-tags-demo"
      options={options}
      disableCloseOnSelect
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      loading={loading}
      getOptionLabel={(option: Option) => option.title}
      renderTags={(selected) =>
        selected.map((option, index) => (
          <span key={index}>{option.title}, </span>
        ))
      }
      renderOption={(props, option: Option) => {
        const isSelected = (field.value || []).some(
          (selectedOption: Option) => selectedOption.title === option.title
        );
        return (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={isSelected}
            />
            {option.title}
          </li>
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

const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'Fight Club', year: 1999 },
  { title: 'Inception', year: 2010 }
];
