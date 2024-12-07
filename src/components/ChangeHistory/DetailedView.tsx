import { useMemo } from 'react';
import {
  Typography,
  Breadcrumbs,
  Stack,
  Chip,
  IconButton,
  Card
} from '@mui/material';
import ReactDiffViewer from 'react-diff-viewer';
import dayjs from 'dayjs';

import { DetailedViewContainer } from './styled';
import ChangeHistoryDiffCard from './DiffCard';
import {
  generalDiffStyles,
  getInfoForConnections,
  getInfoForSubflow,
  newVersionDiffStyles,
  oldVersionDiffStyles
} from './utils';

import { ChangeHistoryRecord, ChangeTypeEnum } from '@domain/changeHistory';
import { customBoxShadows, theme } from '@theme';
import { FULL_DATE_TIME_FORMAT } from '@constants/common';
import AngleLeftIcon from '@icons/angleLeft.svg';
import AngleRightIcon from '@icons/angleRight.svg';
import { StepType } from '@components/FlowManagment/FlowChart/types';

interface DetailedViewProps {
  data: ChangeHistoryRecord;
  selectedRowIndex: number;
  setSelectedRowIndex: (rowIndex: null) => void;
  handlePrevRow: () => void;
  handleNextRow: () => void;
}

const DetailedView = ({
  data,
  selectedRowIndex,
  setSelectedRowIndex,
  handlePrevRow,
  handleNextRow
}: DetailedViewProps) => {
  const selectedRow = useMemo(
    () => data.diffs[selectedRowIndex],
    [data.diffs, selectedRowIndex]
  );

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
            <AngleLeftIcon />
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
            <AngleRightIcon />
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
              styles={generalDiffStyles}
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
                styles={generalDiffStyles}
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
                  styles={oldVersionDiffStyles}
                  newValue={selectedRow.after}
                  oldValue={selectedRow.before}
                  splitView={false}
                  hideLineNumbers={true}
                  showDiffOnly={true}
                />
              </ChangeHistoryDiffCard>
              <ChangeHistoryDiffCard label="New version">
                <ReactDiffViewer
                  styles={newVersionDiffStyles}
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

export default DetailedView;
