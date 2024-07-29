import React, { useMemo } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Breadcrumbs,
  Stack,
  Chip,
  IconButton
} from '@mui/material';
import ReactDiffViewer from 'react-diff-viewer';
import dayjs from 'dayjs';

import { DetailedViewContainer, StyledTableCell } from './styled';

import { ChangeHistoryRecord } from '@domain/changeHistory.ts';
import { theme } from '@theme';
import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import AngelLeft from '@icons/angleLeft.svg';
import AngelRight from '@icons/angleRight.svg';

interface ChangeHistoryDetailedViewProps {
  data: ChangeHistoryRecord;
  selectedRowIndex: number;
  setSelectedRowIndex: (rowIndex: null) => void;
  handlePrevRow: () => void;
  handleNextRow: () => void;
}

const ChangeHistoryDetailedView: React.FC<ChangeHistoryDetailedViewProps> = ({
  data,
  selectedRowIndex,
  setSelectedRowIndex,
  handlePrevRow,
  handleNextRow
}) => {
  const selectedRow = useMemo(
    () => data.diffs[selectedRowIndex],
    [data.diffs, selectedRowIndex]
  );
  return (
    <DetailedViewContainer maxWidth="xl">
      <Breadcrumbs separator="/">
        <Typography
          sx={{ cursor: 'pointer' }}
          onClick={() => setSelectedRowIndex(null)}
          key="change-history"
          variant="body1"
        >
          Changes history
        </Typography>
        <Typography
          key="flow-name"
          variant="body1"
          color={theme.palette.text.primary}
        >
          {data.name}
        </Typography>
      </Breadcrumbs>
      <Typography variant="h4" pt={1} pb={2} color={theme.palette.text.primary}>
        {data.name}
      </Typography>
      <Stack flexDirection="row" justifyContent="space-between">
        <Chip
          sx={{ maxWidth: 'fit-content' }}
          size="small"
          variant="filled"
          label={`${data.name} Last Edited by ${data.pushedBy} on ${dayjs(data.pushedOn).format(FULL_DATE_TIME_FORMAT)}`}
        />
        <Stack flexDirection="row" alignItems="center">
          <IconButton
            disabled={selectedRowIndex <= 0}
            aria-label="prev-changes"
            size="small"
            onClick={handlePrevRow}
          >
            <AngelLeft />
          </IconButton>
          <Typography variant="body2" color={theme.palette.text.secondary}>
            {selectedRowIndex + 1} of {data.diffs.length}
          </Typography>
          <IconButton
            disabled={selectedRowIndex >= data.diffs.length - 1}
            sx={{ margin: 0 }}
            aria-label="next-changes"
            size="small"
            onClick={handleNextRow}
          >
            <AngelRight />
          </IconButton>
        </Stack>
      </Stack>
      <p>{selectedRow.id}</p>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>Before</TableCell>
            <TableCell>After</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <StyledTableCell colSpan={2} width="50%" component="th" scope="row">
              <ReactDiffViewer
                hideLineNumbers
                oldValue={selectedRow.before || ''}
                newValue={selectedRow.after || ''}
                splitView={true}
              />
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </DetailedViewContainer>
  );
};

export default ChangeHistoryDetailedView;
