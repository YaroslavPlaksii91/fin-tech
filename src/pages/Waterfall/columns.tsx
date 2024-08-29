import { GridColDef } from '@mui/x-data-grid-premium';

import { COLUMN_IDS } from './types';
import { getExternalSystemsColumns } from './utils';
import { EXTERNAL_SYSTEM_KEYS, GROUP_COLORS_NAMES } from './constants';

import { roundToHundredths } from '@utils/number';
import { WaterfallReport } from '@domain/waterfallReport';

const STATIC_COLUMNS: GridColDef[] = [
  {
    field: COLUMN_IDS.stack,
    headerName: 'Stack',
    sortable: false,
    width: 168
  },
  {
    field: COLUMN_IDS.campaignId,
    headerName: 'Campaign ID',
    sortable: false,
    width: 168
  },
  {
    field: COLUMN_IDS.totalLooks,
    headerName: 'Total Looks',
    width: 120
  },
  {
    field: COLUMN_IDS.totalApproved,
    headerName: 'Total Approved',
    width: 144
  },
  {
    field: COLUMN_IDS.totalApprovalRate,
    headerName: 'Total Approval Rate',
    width: 168,
    valueFormatter: (value?: number) => {
      if (!value) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< 0.01%' : `${roundedValue}%`;
    }
  },
  {
    field: COLUMN_IDS.totalCost,
    headerName: 'Total Cost',
    width: 104,
    valueFormatter: (value?: number) => {
      if (!value || !Number.isFinite(value)) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalCpa,
    headerName: 'Total CPA',
    width: 104,
    valueFormatter: (value?: number) => {
      if (!value) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalLeadCost,
    headerName: 'Total Lead Cost',
    width: 144,
    valueFormatter: (value?: number) => {
      if (!value) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalDataCost,
    headerName: 'Total Data Cost',
    width: 144,
    valueFormatter: (value?: number) => {
      if (!value) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalTimeouts,
    width: 144,
    headerName: 'Total Timeouts'
  },
  {
    field: COLUMN_IDS.totalCostSavings,
    headerName: 'Total Cost Savings',
    width: 168,
    valueFormatter: (value?: number) => {
      if (!value) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalCachedLead,
    headerName: 'Total Cached Lead',
    width: 168
  }
];

const getDataGridColumns = (data: WaterfallReport['item2']) => {
  const externalSystemsColumns = getExternalSystemsColumns(data);

  const dynamicColumns: GridColDef[] = externalSystemsColumns.map(
    (column, index) => ({
      field: column,
      sortable: false,
      disableReorder: true,
      cellClassName: () => {
        const colorGroupIndex =
          Math.floor(index / EXTERNAL_SYSTEM_KEYS.length) %
          GROUP_COLORS_NAMES.length;

        return GROUP_COLORS_NAMES[colorGroupIndex];
      },
      headerName: column
        .split('/')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      width: 220,
      renderCell: (params) => (params.value as string) ?? '-'
    })
  );

  return [...STATIC_COLUMNS, ...dynamicColumns];
};

export default getDataGridColumns;
