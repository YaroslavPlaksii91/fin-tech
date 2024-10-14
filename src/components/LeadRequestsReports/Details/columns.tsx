import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-premium';
import { Button } from '@mui/material';

import { COLUMN_IDS, RowData } from './types';

interface GetDataGridColumnsProps {
  handleScores: () => void;
  handleRequestResponse: () => void;
}

const getColumns = ({
  handleScores,
  handleRequestResponse
}: GetDataGridColumnsProps): GridColDef[] => [
  {
    field: COLUMN_IDS.api,
    headerName: 'API',
    minWidth: 148
  },
  { field: COLUMN_IDS.time, headerName: 'Time (sec)', minWidth: 143 },
  {
    field: COLUMN_IDS.result,
    headerName: 'Result',
    minWidth: 143
  },
  {
    field: COLUMN_IDS.scores,
    headerName: 'Scores',
    align: 'left',
    resizable: false,
    minWidth: 143,
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
    minWidth: 143,
    renderCell: ({
      row: { requestResponse }
    }: GridRenderCellParams<RowData>) =>
      requestResponse.requestJson || requestResponse.responseJson ? (
        <Button
          size="small"
          variant="text"
          sx={{ minWidth: 'fit-content', padding: '4px 0px' }}
          onClick={handleRequestResponse}
        >
          View
        </Button>
      ) : (
        '-'
      )
  }
];

export default getColumns;
