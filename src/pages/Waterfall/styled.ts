import { styled } from '@mui/material/styles';
import { gridClasses } from '@mui/x-data-grid-premium';
import { lightBlue, teal, lightGreen, deepPurple } from '@mui/material/colors';

import { StyledDataGridPremium as DataGridPremium } from '@components/shared/Table/styled';

export const StyledDataGridPremium = styled(DataGridPremium)(() => ({
  [`& .${gridClasses.row}`]: {
    [`&.even`]: {
      '& .lightBlue': { backgroundColor: lightBlue[50] },
      '& .teal': { backgroundColor: teal[50] },
      '& .lightGreen': { backgroundColor: lightGreen[50] },
      '& .deepPurple': { backgroundColor: deepPurple[50] }
    },
    [`&.odd`]: {
      '& .lightBlue': { backgroundColor: lightBlue[100] },
      '& .teal': { backgroundColor: teal[100] },
      '& .lightGreen': { backgroundColor: lightGreen[100] },
      '& .deepPurple': { backgroundColor: deepPurple[100] }
    }
  }
}));
