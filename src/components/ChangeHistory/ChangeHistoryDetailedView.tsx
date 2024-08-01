import React, { useMemo } from 'react';
import {
  Typography,
  Breadcrumbs,
  Stack,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import ReactDiffViewer, {
  ReactDiffViewerStylesOverride
} from 'react-diff-viewer';
import dayjs from 'dayjs';

import { DetailedViewContainer } from './styled';
import ChangeHistoryDiffCard from './ChangeHistoryDiffCard';

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

  const newStyles: ReactDiffViewerStylesOverride = {
    variables: {
      light: {
        addedBackground: 'none',
        removedBackground: 'none',
        emptyLineBackground: 'none'
      }
    },
    diffContainer: {
      pre: {
        'white-space': 'pre'
      }
    },
    marker: {
      display: 'none'
    }
  };

  const newStyles2 = {
    diffContainer: {
      pre: {
        'white-space': 'pre'
      }
    },
    diffRemoved: {
      display: 'none'
    }
  };

  const newStyles3 = {
    diffContainer: {
      pre: {
        'white-space': 'pre'
      }
    },
    diffAdded: {
      display: 'none'
    }
  };

  return (
    <DetailedViewContainer>
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
      {selectedRow?.name && (
        <Paper sx={{ padding: '4px 16px' }} elevation={1}>
          {selectedRow.before === null && selectedRow.after && (
            <ChangeHistoryDiffCard label="New version">
              <ReactDiffViewer
                styles={newStyles}
                newValue={selectedRow.after || ''}
                splitView={false}
                hideLineNumbers={true}
                showDiffOnly={true}
              />
            </ChangeHistoryDiffCard>
          )}
          {selectedRow.before && selectedRow.after === null && (
            <>
              <ChangeHistoryDiffCard label="Old version">
                <ReactDiffViewer
                  styles={newStyles}
                  oldValue={selectedRow.before}
                  splitView={false}
                  hideLineNumbers={true}
                  showDiffOnly={true}
                />
              </ChangeHistoryDiffCard>
              <ChangeHistoryDiffCard label="New version">
                <Typography variant="body1">Step was deleted</Typography>
              </ChangeHistoryDiffCard>
            </>
          )}
          {selectedRow.before && selectedRow.after && (
            <>
              <ChangeHistoryDiffCard label="Old version">
                <ReactDiffViewer
                  styles={newStyles3}
                  newValue={selectedRow.after}
                  oldValue={selectedRow.before}
                  splitView={false}
                  hideLineNumbers={true}
                  showDiffOnly={true}
                />
              </ChangeHistoryDiffCard>
              <ChangeHistoryDiffCard label="New version">
                <ReactDiffViewer
                  styles={newStyles2}
                  oldValue={selectedRow.before}
                  newValue={selectedRow.after}
                  splitView={false}
                  hideLineNumbers={true}
                  showDiffOnly={true}
                />
              </ChangeHistoryDiffCard>
            </>
          )}
        </Paper>
      )}
    </DetailedViewContainer>
  );
};

export default ChangeHistoryDetailedView;
