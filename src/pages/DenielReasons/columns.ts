import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';

const getDataGridColumns = (): GridColDef[] => [
  {
    field: COLUMN_IDS.denialReason,
    headerName: 'Denial Reasons',
    flex: 1
  },
  { field: COLUMN_IDS.deniedBy, headerName: 'Denied By' },
  { field: COLUMN_IDS.totalCount, headerName: 'Count' },
  {
    field: COLUMN_IDS.percentage,
    headerName: 'Percentage of Total'
  }
];

export default getDataGridColumns;
