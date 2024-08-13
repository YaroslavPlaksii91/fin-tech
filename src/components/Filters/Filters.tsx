import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Stack,
  Typography,
  Drawer,
  Button,
  IconButton
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
  IDateFilters,
  IFilterGroup,
  FiltersType,
  IFormState,
  InputFiltersType,
  IInputGroup
} from './types';
import CheckboxGroups from './CheckboxGroups';
import DateFilters from './DateFilters';
import { InputFilters } from './InputFilters';

interface FiltersProps {
  isOpen: boolean;
  hasTimePicker?: boolean;
  filters?: FiltersType;
  dateFilters?: IDateFilters;
  inputFilters?: InputFiltersType;
  inputGroupsToShow?: IInputGroup[];
  filterGroupsToShow?: IFilterGroup[];
  handleReset: () => void;
  handleApply: (data: IFormState) => void;
  handleClose: () => void;
}

const Filters = ({
  isOpen,
  hasTimePicker,
  filters,
  dateFilters,
  inputFilters,
  filterGroupsToShow,
  inputGroupsToShow,
  handleReset,
  handleApply,
  handleClose
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    defaultValues: { inputFilters, filters, dateFilters }
  });

  useEffect(() => {
    reset({ filters, dateFilters, inputFilters });
  }, [isOpen, filters, dateFilters, inputFilters]);

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(handleApply)}>
        <Box sx={{ width: '384px', padding: '8px' }}>
          <Stack spacing={1} alignItems="center" sx={{ padding: '8px 16px' }}>
            <Stack spacing={1} direction="row" alignItems="center" width="100%">
              <IconButton sx={{ padding: '2px' }} onClick={handleClose}>
                <ChevronRightIcon sx={{ fontSize: '28px' }} />
              </IconButton>
              <Typography variant="h6">Filters</Typography>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  gap: '8px'
                }}
              >
                <Button size="small" variant="contained" type="submit">
                  Apply
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  variant="outlined"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Box>
            </Stack>
            <Stack sx={{ width: '100%' }} direction="column" spacing={1}>
              {inputFilters ? (
                <InputFilters
                  control={control}
                  inputGroupsToShow={inputGroupsToShow}
                />
              ) : null}
              {filters ? (
                <CheckboxGroups
                  control={control}
                  filters={filters}
                  filterGroupsToShow={filterGroupsToShow}
                />
              ) : null}
              {dateFilters ? (
                <DateFilters hasTimePicker={hasTimePicker} control={control} />
              ) : null}
            </Stack>
          </Stack>
        </Box>
      </form>
    </Drawer>
  );
};

export default Filters;
