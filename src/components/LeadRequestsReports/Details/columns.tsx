import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { Button } from '@mui/material';

import { COLUMN_IDS, RowData } from './types';

interface GetDataGridColumnsProps {
  handleScores: () => void;
  handleRequestRespoonse: () => void;
}

const getColumns = ({
  handleScores,
  handleRequestRespoonse
}: GetDataGridColumnsProps): GridColDef[] => [
  {
    field: COLUMN_IDS.api,
    headerName: 'API'
  },
  { field: COLUMN_IDS.time, headerName: 'Time (sec)' },
  {
    field: COLUMN_IDS.result,
    headerName: 'Result'
  },
  {
    field: COLUMN_IDS.scores,
    headerName: 'Scores',
    align: 'left',
    resizable: false,
    renderCell: (data: GridRenderCellParams<RowData>) =>
      data.row.scores ? (
        <Button
          size="small"
          variant="text"
          sx={{ minWidth: 'fit-content', padding: '4px 0px' }}
          onClick={handleScores}
        >
          View
        </Button>
      ) : (
        '-'
      )
  },
  {
    field: COLUMN_IDS.requestResponse,
    headerName: 'Request/Response',
    align: 'left',
    flex: 1,
    resizable: false,
    renderCell: ({
      row: { requestResponse }
    }: GridRenderCellParams<RowData>) =>
      requestResponse.requestJson || requestResponse.responseJson ? (
        <Button
          size="small"
          variant="text"
          sx={{ minWidth: 'fit-content', padding: '4px 0px' }}
          onClick={handleRequestRespoonse}
        >
          View
        </Button>
      ) : (
        '-'
      )
  }
];

export default getColumns;
