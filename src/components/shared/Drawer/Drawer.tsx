import MuiDrawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';

import { HEADER_HEIGHT } from '@constants/themeConstants';
import { customBoxShadows } from '@theme';

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    boxSizing: 'border-box',
    borderRadius: 0,
    boxShadow: customBoxShadows.elevation1,
    borderLeft: theme.palette.divider,
    top: HEADER_HEIGHT,
    height: `calc(100% - ${HEADER_HEIGHT}px)`
  }
}));

export default Drawer;
