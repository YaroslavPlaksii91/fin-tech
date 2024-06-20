import { useState } from 'react';

import {
  IDateFilters,
  IFilters,
  IFormState,
  Search
} from '@components/Filters/types';

interface UseFiltersProps {
  initialDateFilters?: IDateFilters;
  initialFilters?: IFilters;
  initialSearch?: Search;
}

const useFilters = ({
  initialDateFilters = { dateFrom: null, dateTo: null },
  initialFilters = {},
  initialSearch = ''
}: UseFiltersProps = {}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState(initialFilters);
  const [dateFrom, setDateFrom] = useState(initialDateFilters.dateFrom);
  const [dateTo, setDateTo] = useState(initialDateFilters.dateTo);

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setDateFrom(initialDateFilters.dateFrom);
    setDateTo(initialDateFilters.dateTo);
    setSearch(initialSearch);
    setFilters(initialFilters);
    handleFiltersClose();
  };

  const handleFiltersApply = ({ dateFilters, filters, search }: IFormState) => {
    if (dateFilters) {
      setDateFrom(dateFilters.dateFrom);
      setDateTo(dateFilters.dateTo);
    }

    if (filters) setFilters(filters);
    if (search) setSearch(search);

    handleFiltersClose();
  };

  return {
    isFiltersOpen,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersReset,
    handleFiltersApply,
    search,
    filters,
    dateFilters: { dateFrom, dateTo }
  };
};

export default useFilters;
