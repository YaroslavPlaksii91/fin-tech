import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemProps, ListItemText } from '@mui/material';
import { NavLinkProps } from 'react-router-dom';

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

export const StyledNavListItem = styled(GeneralListItemStyle)<
  ListItemProps & NavLinkProps
>(({ theme }) => ({
  '&.active': {
    background: theme.palette.secondary.main
  }
}));

export const StyledListItem = styled(GeneralListItemStyle)(({ theme }) => ({
  '&.active': {
    borderLeft: `3px solid ${theme.palette.gray}`
  }
}));

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '.MuiTypography-root': {
    fontSize: '14px',
    color: theme.palette.gray,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}));
