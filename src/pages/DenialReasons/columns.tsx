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
    width: 168
  },
  {
    field: COLUMN_IDS.totalCount,
    headerName: 'Count',
    type: 'number',
    width: 104
  },
  {
    field: COLUMN_IDS.percentage,
    headerName: 'Percentage of Total',
    type: 'number',
    width: 168,
    valueFormatter: (percentage?: number) => {
      if (!percentage) return null;
      const roundedToHundred = Math.round(percentage * 100) / 100;

      return roundedToHundred === 0 ? '< 0.01%' : `${roundedToHundred}%`;
    }
  }
];

export default getDataGridColumns;
