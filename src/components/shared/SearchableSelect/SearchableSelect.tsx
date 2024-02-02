import { useState, useMemo } from 'react';
import {
  FormControl,
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

import { DownIcon, StyledInputLabel, StyledSelect } from './styled';

import { SPECIAL_KEY_CODES } from '@constants/common';

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
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  options: { value: string; label: string }[];
  onChangeCb?: () => void;
}

const SearchableSelect = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  index,
  options,
  control,
  name,
  selectedOptions,
  setSelectedOptions,
  onChangeCb
}: SelectProps<TFieldValues, TName>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState('');

  const displayedOptions = useMemo(
    () => options.filter(({ label }) => findOption({ label, searchText })),
    [searchText]
  );

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, field: { onChange, value } }) => (
        <FormControl sx={{ width: '100%' }}>
          {!value && (
            <StyledInputLabel shrink id="search-select-label">
              Select next step
            </StyledInputLabel>
          )}
          <StyledSelect
            {...field}
            // Disables auto focus on MenuItems and allows TextField to be in focus
            value={value}
            open={isOpen}
            onOpen={handleOpen}
            onClose={handleClose}
            IconComponent={() => <DownIcon open={isOpen} />}
            MenuProps={{ autoFocus: false }}
            id="search-select"
            onChange={(e) => {
              const selectedOption = e.target.value as string;
              setSelectedOptions((prevSelected) => {
                const updatedSelected = [...prevSelected];
                updatedSelected[index] = selectedOption;
                return updatedSelected;
              });
              onChange(selectedOption);
              onChangeCb?.();
            }}
            // This prevents rendering empty string in Select's value
            // if search text would exclude currently selected option.
            renderValue={() =>
              options.find((option) => option.value === value)?.label
            }
          >
            <ListSubheader>
              <TextField
                size="small"
                autoFocus
                placeholder="Search by keyword"
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
                  if (e.key !== SPECIAL_KEY_CODES.Escape) {
                    // Prevents autoselecting item while typing (default Select behaviour)
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {displayedOptions.map((option) => {
              // Check if the option is not selected in other selects
              if (
                !selectedOptions.includes(option.value) ||
                selectedOptions[index] === option.value
              ) {
                return (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                );
              }
              return null;
            })}
          </StyledSelect>
        </FormControl>
      )}
    />
  );
};

export default SearchableSelect;
