import { useState } from 'react';

import {
  IDateFilters,
  IFormState,
  InputFiltersType
} from '@components/Filters/types';

interface UseFiltersProps {
  initialDateFilters?: IDateFilters;
  initialInputFilters?: InputFiltersType;
}

const useFilters = ({
  initialDateFilters = { dateFrom: null, dateTo: null },
  initialInputFilters = {}
}: UseFiltersProps = {}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [inputFilters, setInputFilters] = useState(initialInputFilters);
  const [dateFrom, setDateFrom] = useState(initialDateFilters.dateFrom);
  const [dateTo, setDateTo] = useState(initialDateFilters.dateTo);

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setDateFrom(initialDateFilters.dateFrom);
    setDateTo(initialDateFilters.dateTo);
    setInputFilters(initialInputFilters);
    handleFiltersClose();
  };

  const handleFiltersApply = ({ dateFilters, inputFilters }: IFormState) => {
    if (dateFilters) {
      setDateFrom(dateFilters.dateFrom);
      setDateTo(dateFilters.dateTo);
    }

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
    dateFilters: { dateFrom, dateTo }
  };
};

export default useFilters;
