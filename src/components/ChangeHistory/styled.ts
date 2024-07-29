import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';

export const StyledTableCell = styled(TableCell)(() => ({
  padding: '0 12px',
  whiteSpace: 'pre-line'
}));

export const DetailedViewContainer = styled(Container)(({ theme }) => ({
  position: 'absolute',
  paddingTop: '16px',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
  background: theme.palette.background.default
}));
