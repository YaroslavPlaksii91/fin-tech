import { Tab, Select, ListSubheader } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTab = styled(Tab)(() => ({
  textTransform: 'none',
  padding: '9px 16px'
}));

export const StyledSelect = styled(Select)({
  '& .MuiSelect-select': {
    paddingTop: '8.5px',
    paddingBottom: '8.5px'
  }
});

export const StyledListSubheader = styled(ListSubheader)(({ theme }) => ({
  ...theme.typography.caption,
  paddingTop: '4px',
  paddingBottom: '4px',
  backgroundColor: theme.palette.background.default
}));
