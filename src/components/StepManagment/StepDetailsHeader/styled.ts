import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StepBreadcrumbsLink = styled(Typography)(() => ({
  '&:hover': {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}));
