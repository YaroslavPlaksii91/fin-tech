import { Table, Stack, StackProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTable = styled(Table)(() => ({
  borderRight: '1px solid rgba(209, 217, 226, 0.4)'
}));

export const StyledStack = styled(Stack)<
  StackProps & { onClick: () => void; disabled: boolean }
>(() => ({}));