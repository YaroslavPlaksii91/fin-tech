import { styled } from '@mui/material/styles';

export const GroupHeader = styled('div')(({ theme }) => ({
  padding: '12px 20px 0 20px',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '20px',
  color: theme.palette.gray
}));

export const GroupItems = styled('ul')({
  padding: 0,
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 500,
  '& .MuiAutocomplete-option': {
    padding: '3px 20px 3px 20px'
  }
});
