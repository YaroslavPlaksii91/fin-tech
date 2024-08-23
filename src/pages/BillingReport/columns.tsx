import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';

const getDataGridColumns = (): GridColDef[] => [
  {
    field: COLUMN_IDS.month,
    headerName: 'Month',
    minWidth: 140,
    flex: 1
  },
  {
    field: COLUMN_IDS.vendorName,
    headerName: 'Vendors',
    minWidth: 140,
    flex: 1
  },
  {
    field: COLUMN_IDS.looks,
    headerName: 'Looks',
    minWidth: 140,
    flex: 1
  },
  {
    field: COLUMN_IDS.cost,
    headerName: 'Cost',
    minWidth: 140,
    flex: 1,
    renderCell: (params) => `$${params.value as number}`
  }
];

export default getDataGridColumns;
