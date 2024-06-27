import { ReactNode } from 'react';
import { AccordionDetails, Typography } from '@mui/material';

import { StyledAccordion, StyledAccordionSummary } from './styled';

import { ExpandMoreIcon } from '@components/shared/Icons';

interface AccordionProps {
  isExpanded: boolean;
  title: string;
  content: ReactNode;
  onChange: (_: React.SyntheticEvent, newExpanded: boolean) => void;
}

const Accordion = ({
  isExpanded,
  title,
  content,
  onChange
}: AccordionProps) => (
  <StyledAccordion
    key={title}
    square
    elevation={0}
    sx={{ width: '100%' }}
    expanded={isExpanded}
    onChange={onChange}
  >
    <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="body1">{title}</Typography>
    </StyledAccordionSummary>
    <AccordionDetails>{content}</AccordionDetails>
  </StyledAccordion>
);

export default Accordion;
