import { Accordion, AccordionSummary, styled } from '@mui/material';

export const StyledAccordion = styled(Accordion)(
  ({
    theme: {
      palette: { divider }
    }
  }) => ({
    overflow: 'hidden',
    border: `1px solid ${divider}`,

    '&::before': {
      display: 'none'
    }
  })
);

export const StyledAccordionSummary = styled(AccordionSummary)(
  ({
    theme: {
      palette: { background }
    }
  }) => ({
    minHeight: '40px',
    '&.Mui-expanded': {
      margin: 0,
      minHeight: '40px',
      background: `${background.default}`
    },
    '.MuiAccordionSummary-content': { margin: 0 }
  })
);
