import { Stack, StackProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledStack = styled(Stack)<
  StackProps & { onClick: () => void; disabled: boolean }
>(() => ({}));

export const Head = styled(Stack)(({ theme }) => ({
  display: 'flex',
  height: '32px',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  border: `1px solid ${theme.palette.divider}`
}));
