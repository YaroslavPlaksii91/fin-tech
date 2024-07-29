import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import dayjs from 'dayjs';
import TripOriginIcon from '@mui/icons-material/TripOrigin';

import ChangeHistoryDetailedView from './ChangeHistoryDetailedView';

import { palette } from '@theme';
import { ChangeHistoryRecord } from '@domain/changeHistory.ts';
import { FULL_DATE_TIME_FORMAT } from '@constants/common.tsx';
import { Row } from '@components/ChangeHistory/ChangeHistory.utils.tsx';

const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = ({ data }) => {
  const diffsList = useMemo(() => {
    if (data.diffs) {
      return data.diffs;
    }
    return [];
  }, [data]);

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleRowClick = (rowId: string) => {
    const index = diffsList.findIndex((row) => row.id === rowId);
    setSelectedRowIndex(index);
  };

  const handleNextRow = () => {
    if (selectedRowIndex !== null && selectedRowIndex < diffsList.length - 1) {
      setSelectedRowIndex(selectedRowIndex + 1);
    }
  };

  const handlePrevRow = () => {
    if (selectedRowIndex !== null && selectedRowIndex > 0) {
      setSelectedRowIndex(selectedRowIndex - 1);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap={3}
    >
      <TripOriginIcon sx={{ fontSize: 28, flexShrink: 0 }} />
      <Box flexGrow={1}>
        <Typography variant="body1" color="gray">
          <Typography component="span" fontWeight={600} color={palette.dark}>
            {data.name}
          </Typography>{' '}
          was updated on{' '}
          <Typography component="span" fontWeight={600} color={palette.dark}>
            {dayjs(data.pushedOn).format(FULL_DATE_TIME_FORMAT)}
          </Typography>{' '}
          by {data.pushedBy}
        </Typography>
        {data.note && (
          <Typography variant="body1" color="gray">
            {data.note}
          </Typography>
        )}
        <Box mt={1}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="40%">Action type</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell width="40%" align="left">
                    Path
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: palette.aliceBlue }}>
                {diffsList.map((row) => (
                  <Row handleRowClick={handleRowClick} key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
            {selectedRowIndex !== null && (
              <ChangeHistoryDetailedView
                data={data}
                selectedRowIndex={selectedRowIndex}
                setSelectedRowIndex={setSelectedRowIndex}
                handleNextRow={handleNextRow}
                handlePrevRow={handlePrevRow}
              />
            )}
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

interface ChangeHistoryItemProps {
  data: ChangeHistoryRecord;
}

export default ChangeHistoryItem;
