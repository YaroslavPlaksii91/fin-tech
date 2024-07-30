import {
  Typography,
  TextField,
  Box,
  TablePagination as MuiTablePagination,
  Stack
} from '@mui/material';
import { useEffect, useState } from 'react';

import { theme } from '@theme';
import { isInteger } from '@utils/validation';

interface TablePaginationProps {
  isDisabled?: boolean;
  count: number;
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;
  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onPageApply: (page: number) => void;
}

const TablePagination = ({
  isDisabled = false,
  count,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onPageApply
}: TablePaginationProps) => {
  const [enteredPage, setEnteredPage] = useState('');

  const handlePageByTextField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEnteredPage(e.target.value);
  };

  const handlePageApply = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Enter') return;

    if (
      !isInteger(enteredPage) ||
      +enteredPage < 1 ||
      +enteredPage > totalPages + 1
    ) {
      setEnteredPage(`${page + 1}`);
      return;
    }

    onPageApply(+enteredPage - 1);
  };

  useEffect(() => {
    setEnteredPage(`${page + 1}`);
  }, [page]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        p: '8px 16px'
      }}
    >
      <MuiTablePagination
        sx={{ flex: 1 }}
        showFirstButton
        showLastButton
        disabled={isDisabled}
        component="div"
        count={count}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
      <Stack direction="row" alignItems="center">
        <TextField
          disabled={isDisabled || !totalPages}
          sx={{ borderRadius: '8px', maxWidth: '64px', mr: 1 }}
          size="small"
          value={enteredPage}
          onChange={handlePageByTextField}
          onKeyDown={handlePageApply}
        />
        <Typography variant="caption" color={theme.palette.text.secondary}>
          of {totalPages + 1} pages
        </Typography>
      </Stack>
    </Box>
  );
};

export default TablePagination;
