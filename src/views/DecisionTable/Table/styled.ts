import { Stack, TableBody } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Head = styled(Stack)(({ theme }) => ({
  display: 'flex',
  height: '32px',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '8px',
  border: `1px solid ${theme.palette.divider}`
}));

export const StyledTableBody = styled(TableBody)(({ theme }) => ({
  tr: {
    td: {
      ':first-child': { borderLeft: `1px solid ${theme.palette.divider}` },
      ':last-child': { borderRight: `1px solid ${theme.palette.divider}` }
    },
    ':first-child': {
      td: {
        borderTop: `1px solid ${theme.palette.divider}`,
        ':first-child': { borderTopLeftRadius: '8px' },
        ':last-child': { borderTopRightRadius: '8px' }
      }
    },
    ':last-child': {
      borderBottom: `1px solid ${theme.palette.divider}`,
      td: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        ':first-child': { borderBottomLeftRadius: '8px' },
        ':last-child': { borderBottomRightRadius: '8px' }
      },
      ':has(td:first-child:last-child)': { td: { borderRadius: '0 0 8px 8px' } }
    }
  }
}));
