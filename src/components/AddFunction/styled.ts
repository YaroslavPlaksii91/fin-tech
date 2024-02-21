import { Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledContainer = styled(Box)(({ theme }) => ({
  width: '280px',
  maxHeight: '314px',
  padding: '12px 12px 30px 12px',
  borderRadius: '8px',
  backgroundColor: theme.palette.aliceBlue,
  border: `1px solid ${theme.palette.grayBorder}`
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '24px',
  height: '26px',
  color: theme.palette.gray,
  border: `1px solid ${theme.palette.grayBorder}`,
  background: theme.palette.secondary.main
}));
