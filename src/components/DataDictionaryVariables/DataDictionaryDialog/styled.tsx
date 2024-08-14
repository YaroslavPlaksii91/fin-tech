import { styled } from '@mui/material/styles';
import { ListItemButton, ListSubheader } from '@mui/material';

export const StyledListSubheader = styled(ListSubheader)(
  ({ theme: { palette } }) => ({
    borderTop: '1px solid',
    borderBottom: '1px solid',
    padding: '8px 24px 8px 24px',
    borderColor: palette.divider,
    background: palette.background.default,
    color: palette.text.primary,
    fontWeight: 400,
    marginBottom: '8px'
  })
);

export const StyledListItemButton = styled(ListItemButton)(
  ({ theme: { palette } }) => ({
    margin: '0 8px',
    borderRadius: 0,
    ' &.Mui-selected': {
      backgroundColor: palette.amber,
      color: palette.primary.main
    }
  })
);
