import { Accordion, AccordionSummary, styled } from '@mui/material';

import { theme } from '@theme';

export const StyledAccordion = styled(Accordion)(() => ({
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,

  '&::before': {
    display: 'none'
  }
}));

export const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  minHeight: '40px',
  '&.Mui-expanded': {
    minHeight: '40px',
    background: `${theme.palette.background.default}`
  },
  '.MuiAccordionSummary-content': { margin: 0 }
}));
