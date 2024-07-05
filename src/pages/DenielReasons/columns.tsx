import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';

const getDataGridColumns = (): GridColDef[] => [
  {
    field: COLUMN_IDS.denialReason,
    headerName: 'Denial Reasons',
    flex: 2
  },
  {
    field: COLUMN_IDS.deniedBy,
    headerName: 'Denied By',
    minWidth: 100
  },
  {
    field: COLUMN_IDS.totalCount,
    headerName: 'Count',
    type: 'number',
    minWidth: 100
  },
  {
    field: COLUMN_IDS.percentage,
    headerName: 'Percentage of Total',
    type: 'number',
    minWidth: 200,
    valueFormatter: (value) => {
      if (!value) return null;
      const factor = Math.pow(10, 2);

      return `${Math.round(value * factor) / factor}%`;
    }
  }
];

export default getDataGridColumns;
