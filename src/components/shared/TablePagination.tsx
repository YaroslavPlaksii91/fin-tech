import {
  Typography,
  TextField,
  Box,
  TablePagination as MuiTablePagination
} from '@mui/material';

import { theme } from '@theme';

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
  onPageByInputChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const TablePagination = ({
  isDisabled = false,
  count,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onPageByInputChange
}: TablePaginationProps) => (
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
    <TextField
      disabled={isDisabled || !totalPages}
      type="number"
      sx={{ borderRadius: '8px', maxWidth: '64px', mr: 1 }}
      size="small"
      value={page + 1}
      onChange={onPageByInputChange}
    />
    <Typography variant="body1" color={theme.palette.text.secondary}>
      of {totalPages} pages
    </Typography>
  </Box>
);

export default TablePagination;
