import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import { ListProps, ListItemProps, List } from '@mui/material';

import {
  CROSS_PLATFORM_DRAWER_WIDTH,
  HEADER_HEIGHT
} from '@constants/themeConstants';

const getGradient = (r1 = 0, g1 = 0, b1 = 0, r2 = 0, g2 = 0, b2 = 0) => ({
  background: `linear-gradient(
    180deg,
    rgba(${r1}, ${g1}, ${b1}, var(--color-opacity)) 0%,
      rgba(${r2}, ${g2}, ${b2}, var(--color-opacity)) 100%
  )`
});

export const StyledDrawer = styled(MuiDrawer)({
  flexShrink: 0,
  whiteSpace: 'nowrap',

  '& .MuiPaper-root': {
    boxSizing: 'border-box',
    width: CROSS_PLATFORM_DRAWER_WIDTH,
    backgroundColor: '#E7E8EB',
    zIndex: 3,
    overflowX: 'hidden',
    borderRadius: 0
  },
  '& .MuiDrawer-paper': {
    marginTop: HEADER_HEIGHT
  }
});

export const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})<ListItemProps & { isSelected?: boolean }>(({ isSelected }) => ({
  borderRadius: '2px',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: 0,
  display: 'flex',
  alignItems: 'center',
  transition: '--color-opacity 0.3s, all 0.3s',

  '&:hover': {
    '--color-opacity': '16%',
    borderRadius: '6px'
  },

  '&.iam': getGradient(188, 243, 255, 240, 187, 0),
  '&.communication': getGradient(195, 218, 253, 57, 77, 106),
  '&.admin': getGradient(0, 211, 59, 0, 117, 255),
  '&.lms': getGradient(144, 135, 245, 163, 35, 184),
  '&.underwriting': getGradient(255, 212, 60, 225, 88, 88),
  '&.leads': getGradient(177, 239, 0, 64, 184, 35),
  '&.payments': getGradient(255, 235, 56, 205, 114, 0),
  '&.reports': getGradient(73, 158, 255, 78, 68, 210),
  '&.launcher': getGradient(171, 235, 255, 87, 163, 252),

  '&.MuiListItemButton-root': {
    padding: 0
  },

  ...(isSelected && { '--color-opacity': '16%', borderRadius: '6px' }),
  img: {
    maxWidth: '40px',
    maxHeight: '40px'
  }
}));

export const StyledList = styled(List)<ListProps>(() => ({
  padding: '16px 8px 50px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px'
}));
