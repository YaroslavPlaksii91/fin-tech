import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  paddingBottom: '16px'
}));