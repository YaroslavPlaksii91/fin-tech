import { Stack, Typography, Select, MenuItem, Pagination } from '@mui/material';
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
        <Select
          value={page + 1}
          onChange={(event) => {
            apiRef.current.setPage(+event.target.value - 1);
          }}
          size="small"
          displayEmpty
          inputProps={{ 'aria-label': ' Go to page' }}
        >
          {Array.from({ length: pageCount }, (_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Pagination
        sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(_event, value) => apiRef.current.setPage(value - 1)}
      />
    </Stack>
  );
};

export default DataGridPagination;
