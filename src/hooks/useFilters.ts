import { useState } from 'react';

import {
  IDateFilters,
  FiltersType,
  IFormState,
  InputFiltersType
} from '@components/Filters/types';

interface UseFiltersProps {
  initialDateFilters?: IDateFilters;
  initialFilters?: FiltersType;
  initialInputFilters?: InputFiltersType;
}

const useFilters = ({
  initialDateFilters = { dateFrom: null, dateTo: null },
  initialFilters = {},
  initialInputFilters = {}
}: UseFiltersProps = {}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [inputFilters, setInputFilters] = useState(initialInputFilters);
  const [filters, setFilters] = useState(initialFilters);
  const [dateFrom, setDateFrom] = useState(initialDateFilters.dateFrom);
  const [dateTo, setDateTo] = useState(initialDateFilters.dateTo);

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setDateFrom(initialDateFilters.dateFrom);
    setDateTo(initialDateFilters.dateTo);
    setInputFilters(initialInputFilters);
    setFilters(initialFilters);
    handleFiltersClose();
  };

  const handleFiltersApply = ({
    dateFilters,
    filters,
    inputFilters
  }: IFormState) => {
    if (dateFilters) {
      setDateFrom(dateFilters.dateFrom);
      setDateTo(dateFilters.dateTo);
    }

    if (filters) setFilters(filters);
    if (inputFilters) setInputFilters(inputFilters);

    handleFiltersClose();
  };

  return {
    isFiltersOpen,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersReset,
    handleFiltersApply,
    inputFilters,
    filters,
    dateFilters: { dateFrom, dateTo }
  };
};

export default useFilters;
