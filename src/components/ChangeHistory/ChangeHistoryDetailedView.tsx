import React, { useMemo } from 'react';
import {
  Typography,
  Breadcrumbs,
  Stack,
  Chip,
  IconButton,
  Card
} from '@mui/material';
import ReactDiffViewer, {
  ReactDiffViewerStylesOverride
} from 'react-diff-viewer';
import dayjs from 'dayjs';

import { DetailedViewContainer } from './styled';
import ChangeHistoryDiffCard from './ChangeHistoryDiffCard';
import { getInfoForConnections, getInfoForSubflow } from './utils';

import { ChangeHistoryRecord, ChangeTypeEnum } from '@domain/changeHistory.ts';
import { customBoxShadows, theme } from '@theme';
import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import AngelLeft from '@icons/angleLeft.svg';
import AngelRight from '@icons/angleRight.svg';
import { StepType } from '@components/FlowManagment/FlowChart/types';

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
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
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
      <Card
        variant="outlined"
        sx={{
          padding: '8px 16px',
          boxShadow: customBoxShadows.elevation1,
          borderRadius: '16px',
          '&:not(:last-child)': {
            marginBottom: '8px'
          }
        }}
      >
        {ChangeTypeEnum[selectedRow.changeType] === ChangeTypeEnum[3] && (
          <>
            <ChangeHistoryDiffCard label="Old version">
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Previous Name:
              </Typography>
              <Typography variant="body1">{selectedRow.before}</Typography>
            </ChangeHistoryDiffCard>
            <ChangeHistoryDiffCard label="New version">
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Updated Name:
              </Typography>
              <Typography variant="body1">{selectedRow.after}</Typography>
            </ChangeHistoryDiffCard>
          </>
        )}
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
        {selectedRow.before &&
          selectedRow.after &&
          ChangeTypeEnum[selectedRow.changeType] !== ChangeTypeEnum[3] && (
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
        {selectedRow.sourceName && selectedRow.targetName && (
          <ChangeHistoryDiffCard label="New version">
            <Typography variant="body1">
              {getInfoForConnections(selectedRow)}
            </Typography>
          </ChangeHistoryDiffCard>
        )}
        {selectedRow.before === null &&
          selectedRow.after === null &&
          selectedRow.stepType === StepType.SUBFLOW && (
            <ChangeHistoryDiffCard label="New version">
              <Typography variant="body1">
                {getInfoForSubflow(selectedRow)}
              </Typography>
            </ChangeHistoryDiffCard>
          )}
      </Card>
    </DetailedViewContainer>
  );
};

export default ChangeHistoryDetailedView;
