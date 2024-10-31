import { useCallback, useEffect, useMemo, useState } from 'react';

const useTablePagination = ({
  totalCount,
  initialPage = 0,
  initalRowsPerPage = 25
}: {
  totalCount: number;
  initialPage?: number;
  initalRowsPerPage?: number;
}) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initalRowsPerPage);

  const totalPages = useMemo(
    () => (totalCount ? Math.ceil(totalCount / rowsPerPage) - 1 : 0),
    [totalCount, rowsPerPage]
  );

  const handlePageChange = useCallback(
    (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setRowsPerPage(+event.target.value);
    },
    []
  );

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return {
    page,
    setPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    handlePageChange,
    handleRowsPerPageChange
  };
};

export default useTablePagination;
