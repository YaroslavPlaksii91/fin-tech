import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Stack,
  Typography,
  Drawer,
  Button,
  TextField
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
  IDateFilters,
  IFilterGroups,
  IFilters,
  IFormState,
  Search
} from './types';
import CheckboxGroups from './CheckboxGroups';
import DateFilters from './DateFilters';

interface FiltersProps {
  isOpen: boolean;
  filters?: IFilters;
  filterGroupsToShow?: IFilterGroups[];
  dateFilters?: IDateFilters;
  search?: Search;
  handleReset: () => void;
  handleApply: (data: IFormState) => void;
  handleClose: () => void;
}

const Filters = ({
  isOpen,
  filters,
  dateFilters,
  search,
  filterGroupsToShow,
  handleReset,
  handleApply,
  handleClose
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    defaultValues: { search, filters, dateFilters }
  });

  useEffect(() => {
    reset({ filters, dateFilters, search });
  }, [isOpen, filters, dateFilters, search]);

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(handleApply)}>
        <Box sx={{ width: '384px', padding: '8px' }}>
          <Stack spacing={1} alignItems="center" sx={{ padding: '8px 16px' }}>
            <Stack spacing={1} direction="row" alignItems="center" width="100%">
              <ChevronRightIcon sx={{ fontSize: '32px' }} />
              <Typography variant="h6">Filters</Typography>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'flex-end',
                  gap: '8px'
                }}
              >
                <Button
                  size="small"
                  color="success"
                  variant="contained"
                  type="submit"
                >
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
              {typeof search !== 'undefined' ? (
                <Controller
                  control={control}
                  name="search"
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      placeholder="Search by Keyword"
                      type="text"
                      size="small"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              ) : null}
              {filters ? (
                <CheckboxGroups
                  control={control}
                  filters={filters}
                  filterGroupsToShow={filterGroupsToShow}
                />
              ) : null}
              {dateFilters ? <DateFilters control={control} /> : null}
            </Stack>
          </Stack>
        </Box>
      </form>
    </Drawer>
  );
};

export default Filters;
