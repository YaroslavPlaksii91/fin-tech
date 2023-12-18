import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemText } from '@mui/material';

export const StyledList = styled(List)(() => ({
  height: '100%',
  overflow: 'auto'
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: '16px',
  '&:hover': {
    cursor: 'pointer',
    background: theme.palette.secondary.main
  }
}));

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '.MuiTypography-root': {
    fontSize: '14px',
    color: theme.palette.gray
  }
}));
