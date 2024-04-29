import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

import { HEADER_HEIGHT } from '@constants/themeConstants';

export const StyledLayoutContainer = styled(Box)(() => ({
  position: 'relative',
  display: 'flex',
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  overflow: 'hidden'
}));
