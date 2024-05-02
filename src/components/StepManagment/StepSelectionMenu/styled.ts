import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledRhombButton = styled(Button)(({ theme: { palette } }) => ({
  minWidth: '24px',
  height: '24px',
  width: '24px',
  padding: '5px',
  borderRadius: '50%',
  background: palette.background.default,
  border: `1px solid ${palette.divider}`,
  ':hover': {
    backgroundColor: palette.primary.main,
    color: palette.white
  }
}));
