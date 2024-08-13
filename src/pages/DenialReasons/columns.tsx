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
    valueFormatter: (percentage?: number) => {
      if (!percentage) return null;
      const roundedToHundred = Math.round(percentage * 100) / 100;

      return roundedToHundred === 0 ? '< 0.01%' : `${roundedToHundred}%`;
    }
  }
];

export default getDataGridColumns;
