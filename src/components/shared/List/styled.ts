import { styled } from '@mui/material/styles';
import { List, ListItem, ListItemProps, ListItemText } from '@mui/material';
import { NavLinkProps } from 'react-router-dom';

export const StyledList = styled(List)(() => ({
  height: '100%',
  overflow: 'auto'
}));

export const StyledNavListItem = styled(ListItem)<ListItemProps & NavLinkProps>(
  ({ theme }) => ({
    paddingLeft: '16px',
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.secondary.main
    },
    '&.active': {
      background: theme.palette.secondary.main
    }
  })
);

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  '.MuiTypography-root': {
    fontSize: '14px',
    color: theme.palette.gray,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
}));
