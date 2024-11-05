import { useCallback, useState } from 'react';

const useFilters = <T>(initialData: T) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<T>(initialData);

  const handleFiltersOpen = useCallback(() => setIsFiltersOpen(true), []);

  const handleFiltersClose = useCallback(() => setIsFiltersOpen(false), []);

  const handleFiltersReset = useCallback(() => {
    setFilters(initialData);
    handleFiltersClose();
  }, [initialData]);

  const handleFiltersSubmit = useCallback((data: T) => {
    setFilters(data);
    handleFiltersClose();
  }, []);

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
