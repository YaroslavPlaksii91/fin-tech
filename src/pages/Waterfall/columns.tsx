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
    headerName: 'Total Accepted',
    width: 144
  },
  {
    field: COLUMN_IDS.totalApprovalRate,
    headerName: 'Accept Rates',
    width: 168,
    valueFormatter: (value) => {
      if (!value || value === '-') return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< 0.01%' : `${roundedValue}%`;
    }
  },
  {
    field: COLUMN_IDS.totalCost,
    headerName: 'Total Cost',
    width: 104,
    valueFormatter: (value) => {
      if (!value || value === '-' || !Number.isFinite(value)) return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalCpa,
    headerName: 'Total CPA',
    width: 104,
    valueFormatter: (value) => {
      if (!value || value === '-') return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalLeadCost,
    headerName: 'Total Lead Cost',
    width: 144,
    valueFormatter: (value) => {
      if (!value || value === '-') return '-';
      const roundedValue = roundToHundredths(value);

      return value > 0 && roundedValue === 0 ? '< $0.01' : `$${roundedValue}`;
    }
  },
  {
    field: COLUMN_IDS.totalDataCost,
    headerName: 'Total Data Cost',
    width: 144,
    valueFormatter: (value) => {
      if (!value || value === '-') return '-';
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
    valueFormatter: (value) => {
      if (!value || value === '-') return '-';
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

const getDataGridColumns = (data: WaterfallReport[]) => {
  const externalSystemsColumns = getExternalSystemsColumns(data);

  const dynamicColumns: GridColDef[] = externalSystemsColumns.map(
    (column, index) => ({
      field: column,
      sortable: false,
      disableReorder: true,
      resizable: index !== externalSystemsColumns.length - 1,
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
      valueFormatter: (value: number) => {
        const isCostOrSavings = /cost|savings/i.test(column);
        if (value && isCostOrSavings) return `$${value}`;
        return value || '-';
      }
    })
  );

  const staticColumns = dynamicColumns.length
    ? STATIC_COLUMNS
    : STATIC_COLUMNS.map((column, index) =>
        index !== STATIC_COLUMNS.length - 1
          ? column
          : { ...column, resizable: false }
      );

  return [...staticColumns, ...dynamicColumns];
};

export default getDataGridColumns;
