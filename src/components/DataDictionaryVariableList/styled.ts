import { Tab } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  padding: '12px 16px 12px 0px',
  color: `${theme.palette.gray} !important`
}));
