import { styled } from '@mui/material';
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';

import { theme } from '@theme';

export const StyledDataGridPremium = styled(DataGridPremium)(() => ({
  border: 'transparent',
  width: '600px',

  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: theme.palette.common.white,

    '&:focus-within': {
      outline: 'transparent'
    }
  },
  [`& .${gridClasses.cell}`]: {
    '&:focus-within': {
      outline: `transparent`
    }
  }
}));
