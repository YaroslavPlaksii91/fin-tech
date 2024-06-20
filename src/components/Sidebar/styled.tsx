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

export const Label = styled(Typography)(({ theme: { palette } }) => ({
  borderRadius: '4px',
  padding: '2px 24px',
  marginBottom: '4px',
  background: palette.background.default,
  color: palette.text.secondary
}));

export const SidebarToggle = styled(Button)<ButtonProps & { rotated: number }>(
  ({ rotated }) => ({
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
    color: palette.primary.main,
    '.MuiListItemIcon-root': {
      svg: {
        path: {
          fill: palette.primary.dark,
          fillOpacity: 'unset'
        }
      }
    }
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
  },
  '& .MuiListItem-container': {
    display: 'inline-flex',
    minWidth: '100%',
    width: 'auto'
  }
}));

export const StyledPaper = styled(Paper)(({ theme: { palette } }) => ({
  padding: '16px 8px',
  borderRadius: 0,
  borderRight: `1px solid ${palette.divider}`,
  overflow: 'hidden',
  position: 'relative',
  flexGrow: 0,
  flexShrink: 0,
  maxWidth: '30%'
}));

export const Resizer = styled('div')(({ theme: { palette } }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: '1px',
  cursor: 'col-resize',
  resize: 'horizontal',

  '&:hover': {
    width: '2px',
    background: `${palette.divider}`
  }
}));
