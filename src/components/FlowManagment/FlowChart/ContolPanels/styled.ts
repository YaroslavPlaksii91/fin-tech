import { styled } from '@mui/material/styles';
import { Panel } from 'reactflow';

export const StyledPanel = styled(Panel)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  backgroundColor: theme.palette.background.default,
  padding: '16px 24px',
  margin: '0px !important',
  borderBottom: `1px solid ${theme.palette.divider}`,
  left: 0
}));
