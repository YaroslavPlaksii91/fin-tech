import { useState } from 'react';

const useFilters = <T,>(initialData: T) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<T>(initialData);

  const handleFiltersOpen = () => setIsFiltersOpen(true);

  const handleFiltersClose = () => setIsFiltersOpen(false);

  const handleFiltersReset = () => {
    setFilters(initialData);
    handleFiltersClose();
  };

  const handleFiltersSubmit = (data: T) => {
    setFilters(data);
    handleFiltersClose();
  };

  return {
    isFiltersOpen,
    filters,
    handleFiltersOpen,
    handleFiltersClose,
    handleFiltersReset,
    handleFiltersSubmit
  };
};

export default useFilters;
