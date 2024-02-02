import { Paper, TableContainer } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTableContainer = styled(TableContainer)(() => ({
  maxHeight: `calc(100vh - 450px)`
}));

export const StyledPaper = styled(Paper)(() => ({
  width: '100%',
  overflow: 'hidden',
  marginBottom: '16px'
}));
