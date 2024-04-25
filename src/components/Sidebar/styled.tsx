import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography
} from '@mui/material';
import { ButtonProps } from '@mui/base';
import { NavLink } from 'react-router-dom';

export const StyledPaper = styled(Paper)(({ theme: { palette } }) => ({
  padding: '16px 8px',
  borderRadius: 0,
  borderRight: `1px solid ${palette.divider}`,
  overflow: 'auto'
}));

export const Label = styled(Typography)(({ theme: { palette } }) => ({
  borderRadius: '4px',
  padding: '2px 24px',
  marginBottom: '4px',
  background: palette.background.default,
  color: palette.text.secondary
}));

export const SidebarToggle = styled(Button)<ButtonProps & { rotated: number }>(
  ({ rotated }) => ({
    // justifyContent: rotated ? 'flex-start' : 'flex-center',
    justifyContent: 'flex-start',
    padding: '6px 16px',
    '& .MuiButton-startIcon': {
      ...(rotated && {
        transform: 'rotate(180deg)'
      })
    }
  })
);

export const StyledNavLink = styled(NavLink)(({ theme: { palette } }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'flex',
  flexGrow: 1,
  alignItems: 'center',
  borderRadius: '4px',
  '&.active, &:hover': {
    backgroundColor: palette.amber,
    color: palette.primary.main
  }
}));

export const StyledSubAccordionSummary = styled(AccordionSummary)(() => ({
  alignItems: 'center',
  flexDirection: 'row-reverse',
  minHeight: '28px',
  width: '100%',
  '&.Mui-expanded': {
    minHeight: '28px'
  },
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
    margin: 0
  }
}));

export const StyledMainAccordionSummary = styled(AccordionSummary)(() => ({
  minHeight: '32px',
  '&.Mui-expanded': {
    minHeight: '32px'
  },
  '& .MuiAccordionSummary-content': {
    margin: '0 !important'
  }
}));

export const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  padding: '4px 0'
}));

export const StyledAccordion = styled(Accordion)(() => ({
  padding: '2px 0',
  '&:before': {
    display: 'none'
  }
}));
