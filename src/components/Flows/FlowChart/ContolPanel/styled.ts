import { styled } from '@mui/material/styles';
import { Panel } from 'reactflow';

export const StyledPanel = styled(Panel)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.lightGray,
  padding: '10px 24px',
  margin: '0',
  border: `1px solid ${theme.palette.divider}`,
  left: 0
}));
