import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';

export const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.lightGray,
  padding: '0 8px',
  '&.MuiPaper-root': {
    borderRadius: 0
  }
}));

export const StyledLinkText = styled(Typography)(({ theme }) => ({
  display: 'flex',
  color: theme.palette.gray,
  lineHeight: '22px',
  alignItems: 'center',
  columnGap: '12px'
}));
