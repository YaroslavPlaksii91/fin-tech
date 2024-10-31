import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

import { HEADER_HEIGHT, LAYOUT } from '@constants/themeConstants';

export const StyledLayoutContainer = styled(Box)(({ theme: { palette } }) => ({
  marginTop: HEADER_HEIGHT,
  position: 'fixed',
  display: 'flex',
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  width: '100%',
  overflow: 'auto',
  backgroundColor: palette.background.default
}));

export const Wrapper = styled(Box)(() => ({
  padding: `${LAYOUT.VERTICAL_INDENT}px ${LAYOUT.HORIZONTAL_INDENT}px`
}));
