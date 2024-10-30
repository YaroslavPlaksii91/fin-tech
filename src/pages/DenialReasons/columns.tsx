import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';

import { roundToHundredths } from '@utils/number';

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
    resizable: false,
    valueFormatter: (value?: number) => {
      if (!value) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< 0.01%' : `${roundedValue}%`;
    }
  }
];

export default getDataGridColumns;
