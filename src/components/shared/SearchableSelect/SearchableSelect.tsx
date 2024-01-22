import { useState, useMemo } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  ListSubheader,
  TextField,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';

const findOption = ({
  label,
  searchText
}: {
  label: string;
  searchText: string;
}) => label.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

interface SelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> extends UseControllerProps<TFieldValues, TName> {
  index: number;
  selectedOptions: string[];
  setSelectedOptions: (data: string[]) => void;
  options: { nodeId: string; label: string }[];
}

const SearchableSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  index,
  options,
  control,
  name,
  selectedOptions
}: SelectProps<TFieldValues, TName>) => {
  const [searchText, setSearchText] = useState('');
  const displayedOptions = useMemo(
    () => options.filter(({ label }) => findOption({ label, searchText })),
    [searchText]
  );

  return (
    <FormControl sx={{ width: '220px' }}>
      {/* {!selectedOption && (
        <InputLabel id="search-select-label">Options</InputLabel>
      )} */}
      <Controller
        name={name}
        control={control}
        render={({ field, field: { onChange, value } }) => (
          <Select
            {...field}
            // Disables auto focus on MenuItems and allows TextField to be in focus
            value={value}
            MenuProps={{ autoFocus: false }}
            id="search-select"
            onChange={(e) => {
              // onChange(e.target.value);
              // console.log('e.target.value', e.target.value);
              const selectedOption = e.target.value;
              // setSelectedOptions((prevSelected) => {
              //   const updatedSelected = [...prevSelected];
              //   updatedSelected[index] = selectedOption;
              //   return updatedSelected;
              // });
              if (selectedOption) {
                // setSelectedOptions(['']);
                onChange(selectedOption);
              } else {
                onChange('');
              }
            }}
            onClose={() => setSearchText('')}
            // This prevents rendering empty string in Select's value
            // if search text would exclude currently selected option.
            // renderValue={() => value}
          >
            <ListSubheader>
              <TextField
                size="small"
                autoFocus
                placeholder="Type to search..."
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Escape') {
                    // Prevents autoselecting item while typing (default Select behaviour)
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {/* {displayedOptions.map(({ edgeId, label }, i) => (
                <MenuItem key={i} value={edgeId}>
                  {label}
                </MenuItem>
              ))} */}
            {displayedOptions.map((option) => {
              // Check if the option is not selected in other selects
              if (
                !selectedOptions.includes(option.nodeId) ||
                selectedOptions[index] === option.nodeId
              ) {
                return (
                  <MenuItem key={option.nodeId} value={option.nodeId}>
                    {option.label}
                  </MenuItem>
                );
              }
              return null;
            })}
          </Select>
        )}
      />
    </FormControl>
  );
};

export default SearchableSelect;
