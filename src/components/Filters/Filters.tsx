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
  IFormState,
  InputFiltersType,
  IInputGroup
} from './types';
import DateFilters from './DateFilters';
import { InputFilters } from './InputFilters';

interface FiltersProps {
  isOpen: boolean;
  hasTimePicker?: boolean;
  dateFilters?: IDateFilters;
  inputFilters?: InputFiltersType;
  inputGroupsToShow?: IInputGroup[];
  handleReset: () => void;
  handleApply: (data: IFormState) => void;
  handleClose: () => void;
}

// @TODO: Remove this component and configure filters by using Template.tsx instead in places, where it needed
const Filters = ({
  isOpen,
  hasTimePicker,
  dateFilters,
  inputFilters,
  inputGroupsToShow,
  handleReset,
  handleApply,
  handleClose
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<IFormState>({
    values: { inputFilters, dateFilters }
  });

  useEffect(() => {
    reset();
  }, [isOpen]);

  return (
    <Drawer anchor="right" open={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(handleApply)} onReset={handleReset}>
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
                  type="reset"
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
