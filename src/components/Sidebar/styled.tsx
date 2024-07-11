import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionSummaryProps,
  Box,
  Button,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListProps,
  Typography
} from '@mui/material';
import { ButtonProps } from '@mui/base';
import { NavLink, NavLinkProps } from 'react-router-dom';

import { HEADER_HEIGHT } from '@constants/themeConstants';

const SIDEBAR_TOGGLE_BUTTON_HEIGHT = 62;

export const Label = styled(Typography)(({ theme: { palette } }) => ({
  borderRadius: '4px',
  padding: '2px 24px',
  marginTop: '4px',
  marginBottom: '4px',
  background: palette.background.default,
  color: palette.text.secondary
}));

export const SidebarToggle = styled(Button)<ButtonProps & { expanded: number }>(
  ({ expanded }) => ({
    minWidth: 'auto',
    marginTop: 12,
    marginBottom: 12,
    padding: expanded ? '8px 18px' : '8px',
    justifyContent: expanded ? 'flex-start' : 'center',
    gap: 8,
    transition: 'all 0.2s',
    '& .MuiButton-startIcon': {
      marginRight: '0 !important',
      marginLeft: '0 !important',
      transform: expanded ? 'rotate(0)' : 'rotate(180deg)'
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

  '&.active': {
    backgroundColor: palette.background.default
  },
  '&:hover': {
    backgroundColor: palette.sidebarItemHover
  },
  '&.active, &:hover': {
    color: palette.primary.main,

    '.MuiListItemIcon-root': {
      svg: {
        path: {
          fill: palette.primary.dark,
          fillOpacity: 'unset'
        }
      }
    }
  },

  '& .MuiTypography-root': {
    paddingRight: '36px',
    wordBreak: 'break-word'
  }
}));

export const StyledSubAccordionSummary = styled(AccordionSummary)(() => ({
  alignItems: 'center',
  flexDirection: 'row-reverse',
  minHeight: '28px',
  width: '100%',
  backgroundColor: 'transparent',

  '&.Mui-expanded': {
    minHeight: '28px'
  },
  '& .MuiAccordionSummary-content': {
    alignItems: 'center',
    margin: 0,
    gap: 8
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    transform: 'rotate(-90deg)',
    '&.Mui-expanded': {
      transform: 'rotate(0deg)'
    }
  }
}));

export const StyledMainAccordionSummary = styled(AccordionSummary)<
  AccordionSummaryProps & { expanded: boolean }
>(({ expanded, theme: { palette } }) => ({
  minHeight: '32px',
  backgroundColor: palette.sidebarBackground,
  justifyContent: expanded ? 'flex-start' : 'center',

  '&:hover': {
    borderRadius: '4px',
    backgroundColor: palette.sidebarItemHover
  },

  '&.Mui-expanded': {
    minHeight: '32px'
  },
  '& .MuiAccordionSummary-content': {
    margin: '0 !important',
    gap: 8
  }
}));

export const StyledAccordionDetails = styled(AccordionDetails)(
  ({ theme: { palette } }) => ({
    backgroundColor: palette.sidebarBackground,
    padding: 0,

    '& .MuiList-root': {
      paddingTop: 0,
      paddingBottom: 0
    }
  })
);

export const StyledAccordion = styled(Accordion)(({ theme: { palette } }) => ({
  backgroundColor: palette.sidebarBackground,
  borderBottomLeftRadius: 4,
  borderBottomRightRadius: 4,

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
  borderRadius: 0,
  padding: '0px 8px',
  borderRight: `1px solid ${palette.divider}`,
  overflow: 'hidden',
  position: 'relative',
  flexGrow: 0,
  flexShrink: 0,
  backgroundColor: palette.sidebarBackground,
  boxSizing: 'border-box'
}));

export const Resizer = styled('div')(({ theme: { palette } }) => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  width: 8,
  cursor: 'url(./src/assets/icons/resize-drag.svg) 12 4, col-resize',
  resize: 'horizontal',

  '&:hover': {
    borderRight: `1px solid ${palette.divider}`
  }
}));

export const StyledListItemButton = styled(ListItemButton)<
  ListItemButtonProps & Partial<NavLinkProps> & { expanded?: boolean }
>(({ expanded, theme: { palette } }) => ({
  paddingLeft: expanded ? 16 : 4,
  paddingRight: expanded ? 16 : 4,
  justifyContent: expanded ? 'flex-start' : 'center',
  gap: 8,
  height: 32,
  transition: 'all 0.2s',

  '&.active': {
    backgroundColor: palette.background.default
  },
  '&:hover': {
    background: palette.sidebarItemHover
  }
}));

export const StyledList = styled(List)<ListProps>(() => ({
  paddingTop: 0,
  paddingBottom: 40,

  '& .MuiListItemIcon-root': {
    paddingRight: 0
  }
}));

export const StyledWrapper = styled(Box)(() => ({
  height: `calc(100vh - ${HEADER_HEIGHT}px - ${SIDEBAR_TOGGLE_BUTTON_HEIGHT}px)`,
  overflowX: 'hidden',
  overflowY: 'auto'
}));
