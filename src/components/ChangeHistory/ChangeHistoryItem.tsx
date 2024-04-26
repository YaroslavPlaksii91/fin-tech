import React, { useMemo } from 'react';
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

import { palette } from '../../themeConfig.ts';

import { ChangeHistoryRecord } from '@domain/changeHistory.ts';
import { FULL_DATE_TIME_FORMAT } from '@constants/common.ts';
import { Row } from '@components/ChangeHistory/ChangeHistory.utils.tsx';

const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = ({ data }) => {
  const diffsList = useMemo(() => {
    if (data.diffs) {
      return data.diffs;
    }
    return [];
  }, [data]);

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
                  <Row key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
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
