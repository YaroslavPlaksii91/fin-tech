import { useEffect, useMemo, useState } from 'react';

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

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(+event.target.value);
  };

  const handlePageApply = (newPage: number) => {
    setPage(newPage);
  };

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
    handleRowsPerPageChange,
    handlePageApply
  };
};

export default useTablePagination;
