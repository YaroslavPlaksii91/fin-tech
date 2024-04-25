import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemText } from '@mui/material';

// TODO: remove all styles here
export const StyledList = styled(List)(() => ({
  height: '100%',
  overflow: 'auto'
}));

const GeneralListItemStyle = styled(ListItem)(({ theme }) => ({
  color: theme.palette.gray,
  paddingLeft: '16px',
  '&:hover': {
    cursor: 'pointer',
    background: theme.palette.secondary.main
  }
}));

export const StyledListItem = styled(GeneralListItemStyle)(({ theme }) => ({
  '&.active': {
    borderLeft: `3px solid ${theme.palette.gray}`
  }
}));

export const StyledListItemText = styled(ListItemText)(() => ({
  '.MuiTypography-root': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}));
