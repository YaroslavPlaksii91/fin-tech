import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledError = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  margin: '4px 14px 0 14px'
}));
