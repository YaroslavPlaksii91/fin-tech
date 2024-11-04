import { Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ColoredText = styled(Box)(() => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '16.5px 14px',
  borderRadius: '8px',
  position: 'absolute',
  top: '0.5px',
  left: '0.5px',
  right: 0,
  wordBreak: 'break-word',
  color: '#5f6d7e',
  userSelect: 'none',
  letterSpacing: 0,
  display: 'none' /* uncomment when colors be ready; */
}));

export const StyledPaper = styled(Paper)(() => ({
  width: '400px',
  maxHeight: '300px',
  overflowY: 'auto',
  overflowX: 'hidden',
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  zIndex: 3
}));
