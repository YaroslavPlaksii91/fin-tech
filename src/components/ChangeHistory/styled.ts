import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';

export const StyledTableCell = styled(TableCell)(() => ({
  padding: '0 12px',
  whiteSpace: 'pre-line'
}));

export const DetailedViewContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  padding: '16px 24px 0 24px',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
  background: theme.palette.background.default
}));
