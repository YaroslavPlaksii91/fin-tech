import { Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

export const StyledNavButton = styled(Button)(({ theme: { palette } }) => ({
  borderColor: alpha(palette.common.white, 0.5),
  padding: '5px',
  minWidth: '36px',
  '&:hover': {
    borderColor: palette.common.white
  }
}));
