import { useCallback, useMemo, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { GridRowParams } from '@mui/x-data-grid-premium';

import getColumns from './columns';
import { getFormattedData, getFormattedRows } from './utils';
import { StyledDataGridPremium } from './styled';
import { RowData } from './types';
import Accordion from './Accordion';
import AccordionContent from './AccordionContent';

import Dialog from '@components/shared/Modals/Dialog';
import { LeadRequestsReport } from '@domain/leadRequestsReports';

interface DetailsProps {
  data: LeadRequestsReport;
  handleClose: () => void;
}

export const Details = ({ data, handleClose }: DetailsProps) => {
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(
    null
  );
  const [isApiReviewDialogOpen, setIsApiReviewDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);
  const formattedData = getFormattedData(data);
  const rows = getFormattedRows(formattedData);

  const columns = useMemo(
    () =>
      getColumns({
        handleScores: () => null,
        handleRequestRespoonse: () => setIsApiReviewDialogOpen(true)
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

  const handleChange = useCallback(
    (accordionName: string) =>
      (_: React.SyntheticEvent, newExpanded: boolean) => {
        setExpandedAccordion(newExpanded ? accordionName : null);
      },
    []
  );

  const handleRowSelection = (data: GridRowParams<RowData>) =>
    setSelectedRow(data.row);

  const handleApiReviewDialogClose = () => setIsApiReviewDialogOpen(false);

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
          onClick={handleClose}
          sx={{ marginRight: '8px', padding: '2px' }}
        >
          <ChevronRightIcon sx={{ fontSize: '28px' }} />
        </IconButton>
        <Typography variant="h6">Details</Typography>
      </Box>
      <StyledDataGridPremium
        hideFooter
        autoHeight
        disableColumnReorder
        disableColumnMenu
        showCellVerticalBorder
        showColumnVerticalBorder
        columnHeaderHeight={39}
        rowHeight={52}
        columns={columns}
        rows={rows}
        onRowClick={handleRowSelection}
      />
      <Dialog
        title="Request/Response Details"
        cancelText="Close"
        open={isApiReviewDialogOpen}
        displayConfirmBtn={false}
        onClose={handleApiReviewDialogClose}
      >
        {accordions.map((accordion) => (
          <Accordion
            key={accordion.title}
            isExpanded={expandedAccordion === accordion.title}
            title={accordion.title}
            onChange={handleChange(accordion.title)}
            content={accordion.content}
          />
        ))}
      </Dialog>
    </Box>
  );
};
