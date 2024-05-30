import React, { useCallback, useState, useEffect } from 'react';
import { Stack, Typography, Pagination, TextField } from '@mui/material';
import {
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector
} from '@mui/x-data-grid-premium';

const DataGridPagination = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  const [inputValue, setInputValue] = useState<number | string>(page + 1);

  useEffect(() => {
    setInputValue(page + 1);
  }, [page]);

  const handlePaginationChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    apiRef.current.setPage(value - 1);
  };

  const handlePageByInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const newPage = Number(value) - 1;

      if (!isNaN(newPage) && newPage >= 0 && newPage < pageCount) {
        setInputValue(value);
        apiRef.current.setPage(newPage);
      } else if (value === '') {
        setInputValue(value);
      }
    },
    [apiRef, pageCount]
  );

  const handleBlur = () => {
    const newPage = Number(inputValue) - 1;

    if (isNaN(newPage) || newPage < 0 || newPage >= pageCount) {
      setInputValue(page + 1); // Reset to current page if out of range
    } else {
      apiRef.current.setPage(newPage);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ padding: '12px 24px' }}
    >
      <Stack direction="row" alignItems="center">
        <Typography variant="h6" pr={1}>
          Go to
        </Typography>
        <TextField
          type="number"
          value={inputValue}
          sx={{ borderRadius: '8px', maxWidth: '64px', mr: 1 }}
          size="small"
          onChange={handlePageByInput}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </Stack>
      <Pagination
        sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={handlePaginationChange}
      />
    </Stack>
  );
};

export default DataGridPagination;
