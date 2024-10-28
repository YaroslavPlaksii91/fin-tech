import { useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridRowParams } from '@mui/x-data-grid-premium';

import getColumns from './columns';
import { getFormattedData, getFormattedRows } from './utils';
import { StyledDataGridPremium } from './styled';
import { RowData } from './types';
import Accordion from './Accordion';
import AccordionContent from './AccordionContent';
import Scores from './Scores';

import { LeadRequestReport } from '@domain/leadRequestsReports';
import Dialog from '@components/shared/Modals/Dialog';
interface DetailsProps {
  data: LeadRequestReport;
  onClose: () => void;
}

const Details = ({ data, onClose }: DetailsProps) => {
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    null
  );
  const [isApiReviewOpen, setIsApiReviewOpen] = useState(false);
  const [isScoresOpen, setIsScoresOpen] = useState(false);

  const rows = useMemo(() => getFormattedRows(getFormattedData(data)), [data]);
  const columns = useMemo(
    () =>
      getColumns({
        handleScores: () => setIsScoresOpen(true),
        handleRequestResponse: () => setIsApiReviewOpen(true)
      }),
    []
  );

  const accordions = useMemo(
    () => [
      {
        title: 'Request',
        content: (
          <AccordionContent json={selectedRow?.requestResponse?.requestJson} />
        )
      },
      {
        title: 'Response',
        content: (
          <AccordionContent json={selectedRow?.requestResponse?.responseJson} />
        )
      }
    ],
    [selectedRow?.requestResponse]
  );

  const handleScoresClose = useCallback(() => setIsScoresOpen(false), []);

  const handleApiReviewDialogClose = useCallback(() => {
    setIsApiReviewOpen(false);
    setExpandedAccordion(null);
  }, []);

  const handleChange = useCallback(
    (accordionName: string) =>
      (_: React.SyntheticEvent, newExpanded: boolean) => {
        setExpandedAccordion(newExpanded ? accordionName : null);
      },
    []
  );

  const handleRowSelection = useCallback(
    (data: GridRowParams<RowData>) => setSelectedRow(data.row),
    []
  );

  return (
    <Box sx={{ padding: '8px 24px' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ marginRight: '8px', padding: '2px' }}
        >
          <ChevronRightIcon sx={{ fontSize: '28px' }} />
        </IconButton>
        <Typography variant="h6">Details</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <StyledDataGridPremium
          hideFooter
          disableColumnReorder
          disableColumnMenu
          showCellVerticalBorder
          showColumnVerticalBorder
          columnHeaderHeight={39}
          rowHeight={52}
          columns={columns}
          rows={rows}
          onRowClick={handleRowSelection}
          sx={{ width: '100%' }}
        />
      </Box>
      <Dialog
        title="Request/Response Details"
        cancelText="Close"
        open={isApiReviewOpen}
        displayConfirmBtn={false}
        onClose={handleApiReviewDialogClose}
      >
        <Stack spacing={1}>
          {accordions.map((accordion) => (
            <Accordion
              key={accordion.title}
              isExpanded={expandedAccordion === accordion.title}
              title={accordion.title}
              onChange={handleChange(accordion.title)}
              content={accordion.content}
            />
          ))}
        </Stack>
      </Dialog>
      <Dialog
        displayConfirmBtn={false}
        title={selectedRow?.api || ''}
        open={isScoresOpen}
        onClose={handleScoresClose}
        cancelText="Close"
      >
        <Scores data={selectedRow?.scores} />
      </Dialog>
    </Box>
  );
};

export default Details;
