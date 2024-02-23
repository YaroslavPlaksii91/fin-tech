import { Box, List } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledContainer = styled(Box)(({ theme }) => ({
  width: '704px',
  height: '314px',
  borderRadius: '8px',
  backgroundColor: theme.palette.aliceBlue,
  border: `1px solid ${theme.palette.grayBorder}`,
  padding: '12px 12px 30px 12px'
}));

export const StyledList = styled(List)(() => ({
  padding: 0,
  overflow: 'auto',
  maxHeight: '270px'
}));
