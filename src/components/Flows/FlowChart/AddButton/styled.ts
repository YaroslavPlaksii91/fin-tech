import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledRhombButton = styled(Button)(({ theme }) => ({
  minWidth: '30px',
  height: '30px',
  padding: '5px',
  transform: 'rotate(45deg)',
  borderRadius: '4px',
  background: '#ffff',
  border: `1px solid ${theme.palette.grayLine}`,
  ':hover': {
    backgroundColor: '#2E3646',
    color: '#ffff'
  }
}));
