import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Stack,
  Typography,
  Drawer,
  Button,
  Checkbox,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { IFilterGroups, IFilters } from './types';
import { INITIAL_FILTERS } from './constants';

interface FiltersProps {
  isFiltersOpen: boolean;
  filters: IFilters;
  filterGroupsToShow: IFilterGroups[];
  search: string;
  handleReset: () => void;
  handleApply: (data: { search: string; filters: IFilters }) => void;
  handleClose: () => void;
}

const Filters = ({
  isFiltersOpen,
  filters,
  filterGroupsToShow,
  search,
  handleReset,
  handleApply,
  handleClose
}: FiltersProps) => {
  const { handleSubmit, control, reset } = useForm<{
    search: string;
    filters: IFilters;
  }>({
    defaultValues: { search: '', filters: INITIAL_FILTERS }
  });

  useEffect(() => {
    reset({ search, filters });
  }, [isFiltersOpen, filters, search]);

  return (
    <Drawer anchor="right" open={isFiltersOpen} onClose={handleClose}>
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
            <Stack direction="row" alignItems="center" width="100%">
              <Controller
                control={control}
                name="search"
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    placeholder="Search by Keyword"
                    size="small"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </Stack>
            <Stack alignItems="center" width="100%">
              {filterGroupsToShow.map(({ filterBy, fields, title }) => (
                <Accordion
                  key={filterBy}
                  disableGutters
                  defaultExpanded={Boolean(filters[filterBy].length)}
                  sx={{ width: '100%' }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="body1">{title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup>
                      {fields.map((type: string) => (
                        <FormControlLabel
                          key={type}
                          label={type}
                          control={
                            <Controller
                              control={control}
                              name={`filters.${filterBy}`}
                              render={({ field: { value, onChange } }) => (
                                <Checkbox
                                  checked={value.includes(type)}
                                  onChange={(e) => {
                                    const updatedDataTypes = e.target.checked
                                      ? [...value, type]
                                      : value.filter((item) => item !== type);
                                    onChange(updatedDataTypes);
                                  }}
                                />
                              )}
                            />
                          }
                        />
                      ))}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Stack>
        </Box>
      </form>
    </Drawer>
  );
};

export default Filters;
