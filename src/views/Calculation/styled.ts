import { styled } from '@mui/material/styles';

import { StyledTableCell } from '@components/shared/Table/styled';

export const PinnedTableCell = styled(StyledTableCell)(() => ({
  position: 'sticky',
  right: 0,
  borderLeft: '1px solid rgba(209, 217, 226, 0.4)',
  padding: 0
}));
