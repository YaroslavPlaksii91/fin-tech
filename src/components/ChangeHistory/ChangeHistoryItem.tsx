import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableBody,
  Chip,
  alpha
} from '@mui/material';
import dayjs from 'dayjs';

import ChangeHistoryDetailedView from './ChangeHistoryDetailedView';

import CheckCircleDoneIcon from '@icons/checkCircleDone.svg';
import CheckDuotoneIcon from '@icons/checkDuotone.svg';
import { palette, theme } from '@theme';
import { ChangeHistoryRecord } from '@domain/changeHistory.ts';
import { FULL_DATE_TIME_FORMAT } from '@constants/common.tsx';
import { Row } from '@components/ChangeHistory/ChangeHistory.utils.tsx';
import {
  StyledTableCell,
  StyledTableRow
} from '@components/shared/Table/styled';

interface ChangeHistoryItemProps {
  data: ChangeHistoryRecord;
  index: number;
}

const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = ({
  data,
  index
}) => {
  const diffsList = useMemo(() => {
    if (data.diffs) {
      return data.diffs;
    }
    return [];
  }, [data]);

  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const isFirstRecord = index === 0;

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
    <Box display="flex" gap={2}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Box flexBasis="28px">
          {isFirstRecord ? (
            <CheckDuotoneIcon color={theme.palette.primary.main} />
          ) : (
            <CheckCircleDoneIcon />
          )}
        </Box>
        <Box
          height="100%"
          sx={{
            marginTop: '16px',
            borderRight: `1px solid rgba(0, 0, 0, 0.3)`
          }}
        />
      </Box>

      <Box flexGrow={1}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Typography variant="body1" color={theme.palette.text.secondary}>
            <Typography
              component="span"
              variant="body1"
              color={theme.palette.text.primary}
            >
              {data.name}
            </Typography>{' '}
            was updated on{' '}
            <Typography
              component="span"
              variant="body1"
              color={theme.palette.text.primary}
            >
              {dayjs(data.pushedOn).format(FULL_DATE_TIME_FORMAT)}
            </Typography>{' '}
            by{' '}
            <Typography
              component="span"
              variant="body1"
              color={theme.palette.text.primary}
            >
              {data.pushedBy}
            </Typography>
          </Typography>
          {data.note && (
            <Typography variant="body1" color={theme.palette.text.secondary}>
              {data.note}
            </Typography>
          )}
          {isFirstRecord && (
            <Chip
              label="Active"
              color="success"
              size="small"
              variant="outlined"
              sx={{ background: alpha(palette.green, 0.5) }}
            />
          )}
        </Box>
        <Box mt={1}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell width="40%">Action type</StyledTableCell>
                  <StyledTableCell align="left">Name</StyledTableCell>
                  <StyledTableCell width="40%" align="left">
                    Path
                  </StyledTableCell>
                  <StyledTableCell />
                </StyledTableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: palette.aliceBlue }}>
                {diffsList.map((row, index) => (
                  <Row
                    index={index}
                    handleRowClick={handleRowClick}
                    key={row.id}
                    row={row}
                  />
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

export default ChangeHistoryItem;
