import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';

const getDataGridColumns = (): GridColDef[] => [
  {
    field: COLUMN_IDS.month,
    headerName: 'Month',
    width: 284
  },
  {
    field: COLUMN_IDS.vendorName,
    headerName: 'Vendors',
    width: 284
  },
  {
    field: COLUMN_IDS.looks,
    headerName: 'Looks',
    width: 284
  },
  {
    field: COLUMN_IDS.cost,
    headerName: 'Cost',
    width: 284,
    renderCell: (params) => `$${params.value as number}`
  }
];

export default getDataGridColumns;
