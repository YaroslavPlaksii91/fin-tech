import { styled } from '@mui/material';
import { DataGridPremium, gridClasses } from '@mui/x-data-grid-premium';

export const StyledDataGridPremium = styled(DataGridPremium)(
  ({
    theme: {
      palette: {
        common: { white }
      }
    }
  }) => ({
    border: 'transparent',
    width: '600px',

    [`& .${gridClasses.columnHeader}`]: {
      backgroundColor: white,

      '&:focus-within': {
        outline: 'transparent'
      }
    },
    [`& .${gridClasses.cell}`]: {
      '&:focus-within': {
        outline: `transparent`
      }
    }
  })
);
