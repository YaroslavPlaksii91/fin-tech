import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledRhombButton = styled(Button)(({ theme: { palette } }) => ({
  minWidth: '30px',
  height: '30px',
  padding: '5px',
  transform: 'rotate(45deg)',
  borderRadius: '4px',
  background: palette.white,
  border: `1px solid ${palette.grayLine}`,
  ':hover': {
    backgroundColor: '#2E3646',
    color: palette.white
  }
}));
