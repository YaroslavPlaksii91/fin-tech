import { useMemo, useState } from 'react';

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
    () => Math.ceil(totalCount / rowsPerPage),
    [totalCount, rowsPerPage]
  );

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    event && setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handlePageByInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newPage = Number(event.target.value) - 1;

    if (newPage >= 0 && newPage < totalCount) setPage(newPage);
  };

  return {
    page,
    setPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
    handlePageByInputChange
  };
};

export default useTablePagination;
